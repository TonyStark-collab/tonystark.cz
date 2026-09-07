"""Check the static site's security contract without third-party packages."""

import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.policy = None
        self.referrer = None
        self.script = False

    def fail(self, message):
        errors.append(f"{self.path}: {message}")

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta" and a.get("http-equiv", "").lower() == "content-security-policy":
            if self.policy is not None:
                self.fail("duplicate CSP")
            self.policy = {}
            for part in a.get("content", "").split(";"):
                tokens = part.split()
                if not tokens:
                    continue
                if tokens[0] in self.policy:
                    self.fail("duplicate CSP directive")
                self.policy[tokens[0]] = tokens[1:]
        if tag == "meta" and a.get("name", "").lower() == "referrer":
            self.referrer = a.get("content")
        if tag in ("script", "link", "img", "style", "iframe") and self.policy is None:
            self.fail("resource occurs before CSP")
        if any(k.startswith("on") for k in a) or "style" in a:
            self.fail("inline event handler or style attribute")
        if tag in ("style", "iframe", "object", "embed", "base", "form"):
            self.fail(f"unexpected active element: {tag}")
        self.script = tag == "script" or self.script
        if tag == "script" and not a.get("src"):
            self.fail("inline script")
        if tag in ("script", "img") or (tag == "link" and a.get("rel") in ("stylesheet", "preload")):
            url = a.get("src") if tag != "link" else a.get("href")
            parts = urlsplit(url or "")
            if not url or parts.scheme or parts.netloc or not url.startswith("/"):
                self.fail(f"resource must use a local absolute path: {url}")
            elif not (ROOT / parts.path.lstrip("/")).is_file():
                self.fail(f"missing resource: {url}")
        if tag == "a" and urlsplit(a.get("href", "")).scheme.lower() in ("javascript", "data", "vbscript"):
            self.fail("active link scheme")

    def handle_endtag(self, tag):
        if tag == "script":
            self.script = False

    def handle_data(self, data):
        if self.script and data.strip():
            self.fail("script body must be in an external file")

    def check(self):
        expected = {
            "default-src": ["'none'"], "base-uri": ["'none'"],
            "script-src": ["'self'"], "script-src-attr": ["'none'"],
            "style-src": ["'self'"], "style-src-attr": ["'none'"],
            "img-src": ["'self'", "data:"], "font-src": ["'self'"],
            "object-src": ["'none'"], "frame-src": ["'none'"],
            "worker-src": ["'none'"], "form-action": ["'none'"],
            "connect-src": ["https://api.open-meteo.com"] if self.path == "info-panel/index.html" else ["'none'"],
        }
        if self.policy != expected:
            self.fail("CSP is missing or differs from the reviewed resource allowlist")
        if self.referrer != "strict-origin-when-cross-origin":
            self.fail("missing referrer policy")


tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
pages = [p for p in tracked if p.endswith(".html")]
if not pages:
    errors.append("No tracked HTML pages found")
for name in pages:
    page = Page(name)
    page.feed((ROOT / name).read_text())
    page.check()

# Print file names only: never leak a matching secret into public CI logs.
secret = re.compile(
    r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"
    r"|\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{35,})\b"
    r"|\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{35,}\b"
    r"|\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"
)
for name in filter(None, tracked):
    path = ROOT / name
    if re.search(r"(?:^|/)\.env(?:\.|$)|\.(?:pem|key|p12|pfx)$", name, re.I):
        errors.append(f"{name}: sensitive file must not be tracked")
    try:
        text = path.read_text()
    except (UnicodeError, OSError):
        continue
    if secret.search(text):
        errors.append(f"{name}: possible credential; inspect privately")

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"PASS: {len(pages)} pages; CSP placement, resources, active HTML and credential patterns")

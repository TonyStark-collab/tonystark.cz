from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,subprocess,json
root=Path(__file__).resolve().parents[2]
tracked=set(subprocess.check_output(['git','ls-files'],cwd=root,text=True).splitlines())
errors=[];checked=0
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.refs=[];self.ids=set();self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if 'src' in a:self.refs.append(a['src'])
  if tag in ('a','link','image','use') and 'href' in a:self.refs.append(a['href'])
def verify(source,ref):
 global checked
 u=urlsplit(ref)
 if u.scheme or u.netloc:return
 if not u.path:path=root/source
 elif u.path.startswith('/'):path=root/u.path.lstrip('/')
 else:path=(root/source).parent/u.path
 path=path.resolve()
 if path.is_dir():path/='index.html'
 rel=str(path.relative_to(root));checked+=1
 if not path.is_file() or rel not in tracked:errors.append(f'{source}: missing/untracked {ref}');return
 if u.fragment and path.suffix=='.html' and unquote(u.fragment) not in Page(path.read_text()).ids:errors.append(f'{source}: missing anchor {ref}')
for f in sorted(tracked):
 if f.endswith('.html'):
  for ref in Page((root/f).read_text()).refs:verify(f,ref)
 elif f.startswith('assets/') and f.endswith(('.css','.svg')):
  for ref in re.findall(r'url\([\x22\x27]?([^\x22\x27\)]+)',(root/f).read_text()):
   if not ref.startswith('#'):verify(f,ref)
print(json.dumps({'html_pages':len([f for f in tracked if f.endswith('.html')]),'local_references_checked':checked,'errors':errors},ensure_ascii=False,indent=2));assert not errors

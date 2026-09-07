
    const namedays = {
      "1-1":"Karina","1-2":"Gustav","1-3":"Radmila","1-4":"Diana","1-5":"Dalimil","1-6":"Kašpar","1-7":"Vilma","1-8":"Čestmír","1-9":"Vladan","1-10":"Břetislav","1-11":"Bohdana","1-12":"Pravoslav","1-13":"Edita","1-14":"Radovan","1-15":"Alice","1-16":"Ctirad","1-17":"Drahoslav","1-18":"Vladislav","1-19":"Doubravka","1-20":"Ilona","1-21":"Běla","1-22":"Slavomír","1-23":"Zdeněk","1-24":"Milena","1-25":"Miloš","1-26":"Zora","1-27":"Ingrid","1-28":"Otýlie","1-29":"Zdislava","1-30":"Robin","1-31":"Marika",
      "2-1":"Hynek","2-2":"Nela","2-3":"Blažej","2-4":"Jarmila","2-5":"Dobromila","2-6":"Vanda","2-7":"Veronika","2-8":"Milada","2-9":"Apolena","2-10":"Mojmír","2-11":"Božena","2-12":"Slavěna","2-13":"Věnceslav","2-14":"Valentýn","2-15":"Jiřina","2-16":"Ljuba","2-17":"Miloslava","2-18":"Gizela","2-19":"Patrik","2-20":"Oldřich","2-21":"Lenka","2-22":"Petr","2-23":"Svatopluk","2-24":"Matěj","2-25":"Liliana","2-26":"Dorota","2-27":"Alexandr","2-28":"Lumír","2-29":"Horymír",
      "3-1":"Bedřich","3-2":"Anežka","3-3":"Kamil","3-4":"Stela","3-5":"Kazimír","3-6":"Miroslav","3-7":"Tomáš","3-8":"Gabriela","3-9":"Františka","3-10":"Viktorie","3-11":"Anděla","3-12":"Řehoř","3-13":"Růžena","3-14":"Rút / Matylda","3-15":"Ida","3-16":"Elena / Herbert","3-17":"Vlastimil","3-18":"Eduard","3-19":"Josef","3-20":"Světlana","3-21":"Radek","3-22":"Leona","3-23":"Ivona","3-24":"Gabriel","3-25":"Marián","3-26":"Emanuel","3-27":"Dita","3-28":"Soňa","3-29":"Taťána","3-30":"Arnošt","3-31":"Kvido",
      "4-1":"Hugo","4-2":"Erika","4-3":"Richard","4-4":"Ivana","4-5":"Miroslava","4-6":"Vendula","4-7":"Heřman / Hermína","4-8":"Ema","4-9":"Dušan","4-10":"Darja","4-11":"Izabela","4-12":"Julius","4-13":"Aleš","4-14":"Vincenc","4-15":"Anastázie","4-16":"Irena","4-17":"Rudolf","4-18":"Valérie","4-19":"Rostislav","4-20":"Marcela","4-21":"Alexandra","4-22":"Evženie","4-23":"Vojtěch","4-24":"Jiří","4-25":"Marek","4-26":"Oto","4-27":"Jaroslav","4-28":"Vlastislav","4-29":"Robert","4-30":"Blahoslav",
      "5-1":"Hugo","5-2":"Zikmund","5-3":"Alexej","5-4":"Květoslav","5-5":"Klaudie","5-6":"Radoslav","5-7":"Stanislav","5-8":"Viola","5-9":"Ctibor","5-10":"Blažena","5-11":"Svatava","5-12":"Pankrác","5-13":"Servác","5-14":"Bonifác","5-15":"Žofie","5-16":"Přemysl","5-17":"Aneta","5-18":"Nataša","5-19":"Ivo","5-20":"Zbyšek","5-21":"Monika","5-22":"Emil","5-23":"Vladimír","5-24":"Jana","5-25":"Viola","5-26":"Filip","5-27":"Valdemar","5-28":"Vilém","5-29":"Maxmilián","5-30":"Ferdinand","5-31":"Kamila",
      "6-1":"Laura","6-2":"Jarmil","6-3":"Tamara","6-4":"Dalibor","6-5":"Dobroslav","6-6":"Norbert","6-7":"Iveta","6-8":"Medard","6-9":"Stanislava","6-10":"Gita","6-11":"Bruno","6-12":"Antonie","6-13":"Antonín","6-14":"Roland","6-15":"Vít","6-16":"Zbyněk","6-17":"Adolf","6-18":"Milan","6-19":"Leoš","6-20":"Květa","6-21":"Alois","6-22":"Pavla","6-23":"Zdeňka","6-24":"Jan","6-25":"Ivan","6-26":"Adriana","6-27":"Ladislav","6-28":"Lubomír","6-29":"Petr a Pavel","6-30":"Šárka",
      "7-1":"Jaroslava","7-2":"Patricie","7-3":"Radomír","7-4":"Prokop","7-5":"Cyril a Metoděj","7-6":"Mistr Jan Hus","7-7":"Bohuslava","7-8":"Nora","7-9":"Drahoslava","7-10":"Libuše / Amálie","7-11":"Olga","7-12":"Bořek","7-13":"Markéta","7-14":"Karolína","7-15":"Jindřich","7-16":"Luboš","7-17":"Martina","7-18":"Drahomíra","7-19":"Čeněk","7-20":"Ilja","7-21":"Vítězslav","7-22":"Magdaléna","7-23":"Libor","7-24":"Kristýna","7-25":"Jakub","7-26":"Anna","7-27":"Věroslav","7-28":"Viktor","7-29":"Marta","7-30":"Bořivoj","7-31":"Ignác",
      "8-1":"Oskar","8-2":"Gustav","8-3":"Miluše","8-4":"Dominik","8-5":"Kristián","8-6":"Oldřiška","8-7":"Lada","8-8":"Soběslav","8-9":"Roman","8-10":"Vavřinec","8-11":"Zuzana","8-12":"Klára","8-13":"Alena","8-14":"Alan","8-15":"Hana","8-16":"Jáchym","8-17":"Petra","8-18":"Helena","8-19":"Ludvík","8-20":"Bernard","8-21":"Johana","8-22":"Bohuslav","8-23":"Sandra","8-24":"Bartoloměj","8-25":"Radim","8-26":"Luděk","8-27":"Otakar","8-28":"Augustýn","8-29":"Evelína","8-30":"Vladěna","8-31":"Pavlína",
      "9-1":"Linda / Samuel","9-2":"Adéla","9-3":"Bronislav","9-4":"Jindřiška","9-5":"Boris","9-6":"Boleslav","9-7":"Regína","9-8":"Mariana","9-9":"Daniela","9-10":"Irma","9-11":"Denisa","9-12":"Marie","9-13":"Lubor","9-14":"Radka","9-15":"Jolana","9-16":"Ludmila","9-17":"Naděžda","9-18":"Kryštof","9-19":"Zita","9-20":"Oleg","9-21":"Matouš","9-22":"Darina","9-23":"Berta","9-24":"Jaromír","9-25":"Zlata","9-26":"Andrea","9-27":"Jonáš","9-28":"Václav","9-29":"Michal","9-30":"Jeroným",
      "10-1":"Igor","10-2":"Olívie / Oliver","10-3":"Bohumil","10-4":"František","10-5":"Eliška","10-6":"Hanuš","10-7":"Justýna","10-8":"Věra","10-9":"Štefan / Sára","10-10":"Marina","10-11":"Andrej","10-12":"Marcel","10-13":"Renáta","10-14":"Agáta","10-15":"Tereza","10-16":"Havel","10-17":"Hedvika","10-18":"Lukáš","10-19":"Michaela","10-20":"Vendelín","10-21":"Brigita","10-22":"Sabina","10-23":"Teodor","10-24":"Nina","10-25":"Beáta","10-26":"Erik","10-27":"Šarlota","10-28":"Den vzniku samostatného československého státu","10-29":"Silvie","10-30":"Tadeáš","10-31":"Štěpánka",
      "11-1":"Felix","11-2":"Tobiáš","11-3":"Hubert","11-4":"Karel","11-5":"Miriam","11-6":"Liběna","11-7":"Saskie","11-8":"Bohumír","11-9":"Bohdan","11-10":"Evžen","11-11":"Martin","11-12":"Benedikt","11-13":"Tibor","11-14":"Sáva","11-15":"Leopold","11-16":"Otmar","11-17":"Mahulena","11-18":"Romana","11-19":"Alžběta","11-20":"Nikola","11-21":"Albert","11-22":"Cecílie","11-23":"Klement","11-24":"Emílie","11-25":"Kateřina","11-26":"Artur","11-27":"Xenie","11-28":"René","11-29":"Zina","11-30":"Ondřej",
      "12-1":"Iva","12-2":"Blanka","12-3":"Svatoslav","12-4":"Barbora","12-5":"Jitka","12-6":"Mikuláš","12-7":"Ambrož","12-8":"Květoslava","12-9":"Vratislav","12-10":"Julie","12-11":"Dana","12-12":"Simona","12-13":"Lucie","12-14":"Lýdie","12-15":"Radana","12-16":"Albína","12-17":"Daniel","12-18":"Miloslav","12-19":"Ester","12-20":"Dagmar","12-21":"Natálie","12-22":"Šimon","12-23":"Vlasta","12-24":"Adam a Eva","12-25":"Boží hod vánoční","12-26":"Štěpán","12-27":"Žaneta","12-28":"Bohumila","12-29":"Judita","12-30":"David","12-31":"Silvestr"
    };

    const stateHolidays = {
      "1-1":"Nový rok / Den obnovy samostatného českého státu",
      "5-1":"Svátek práce",
      "5-8":"Den vítězství",
      "7-5":"Den slovanských věrozvěstů Cyrila a Metoděje",
      "7-6":"Den upálení mistra Jana Husa",
      "9-28":"Den české státnosti",
      "10-28":"Den vzniku samostatného československého státu",
      "11-17":"Den boje za svobodu a demokracii",
      "12-24":"Štědrý den",
      "12-25":"1. svátek vánoční",
      "12-26":"2. svátek vánoční"
    };

    const weatherMap = {
      0: { text: "Jasno", icon: "sun" },
      1: { text: "Převážně jasno", icon: "sun" },
      2: { text: "Polojasno", icon: "cloud" },
      3: { text: "Zataženo", icon: "cloud" },
      45: { text: "Mlha", icon: "cloud" },
      48: { text: "Námrazová mlha", icon: "cloud" },
      51: { text: "Slabé mrholení", icon: "cloud-rain" },
      53: { text: "Mrholení", icon: "cloud-rain" },
      55: { text: "Silné mrholení", icon: "cloud-rain" },
      56: { text: "Mrznoucí mrholení", icon: "cloud-rain" },
      57: { text: "Silné mrznoucí mrholení", icon: "cloud-rain" },
      61: { text: "Slabý déšť", icon: "cloud-rain" },
      63: { text: "Déšť", icon: "cloud-rain" },
      65: { text: "Silný déšť", icon: "cloud-rain" },
      66: { text: "Mrznoucí déšť", icon: "cloud-rain" },
      67: { text: "Silný mrznoucí déšť", icon: "cloud-rain" },
      71: { text: "Slabé sněžení", icon: "snowflake" },
      73: { text: "Sněžení", icon: "snowflake" },
      75: { text: "Silné sněžení", icon: "snowflake" },
      77: { text: "Sněhová zrna", icon: "snowflake" },
      80: { text: "Přeháňky", icon: "cloud-rain" },
      81: { text: "Dešťové přeháňky", icon: "cloud-rain" },
      82: { text: "Silné přeháňky", icon: "cloud-rain" },
      85: { text: "Sněhové přeháňky", icon: "snowflake" },
      86: { text: "Silné sněhové přeháňky", icon: "snowflake" },
      95: { text: "Bouřka", icon: "cloud-lightning" },
      96: { text: "Bouřka s krupkami", icon: "cloud-lightning" },
      99: { text: "Silná bouřka", icon: "cloud-lightning" }
    };

    const dayEl = document.getElementById("today-day");
    const numberEl = document.getElementById("today-number");
    const dateEl = document.getElementById("today-date");
    const timeEl = document.getElementById("today-time");
    const secondsEl = document.getElementById("today-seconds");
    const holidayLabelEl = document.getElementById("holiday-label");
    const holidayInfoEl = document.getElementById("holiday-info");
    const scene = document.getElementById("daily-scene");
    const clock = document.getElementById("analog-clock");
    const dial = clock.getContext("2d");
    const clockFace = new Image();
    clockFace.src = "/assets/day-clock-face.webp";
    clockFace.onload = () => drawClock(new Date());
    document.fonts.ready.then(() => drawClock(new Date()));

    // The paper dial is a photograph; all marks and hands show live time.
    function drawClock(now) {
      if (!dial || !clockFace.complete || !clockFace.naturalWidth) return;
      dial.clearRect(0, 0, 800, 800);
      dial.drawImage(clockFace, 0, 0, 800, 800);
      dial.save();
      dial.translate(400, 400);
      dial.strokeStyle = "#f5efdb";
      for (let tick = 0; tick < 60; tick++) {
        const angle = tick * Math.PI / 30;
        const major = tick % 5 === 0;
        const inner = major ? 312 : 325;
        dial.lineWidth = major ? 4 : 2;
        dial.beginPath();
        dial.moveTo(Math.sin(angle) * inner, -Math.cos(angle) * inner);
        dial.lineTo(Math.sin(angle) * 338, -Math.cos(angle) * 338);
        dial.stroke();
      }
      dial.fillStyle = "#f5efdb";
      dial.textAlign = "center";
      dial.textBaseline = "middle";
      dial.font = '500 57px RobotoCondensed, sans-serif';
      for (let hour = 1; hour <= 12; hour++) {
        const angle = hour * Math.PI / 6;
        dial.fillText(String(hour), Math.sin(angle) * 267, -Math.cos(angle) * 267 + 3);
      }
      const seconds = now.getSeconds();
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;
      function hand(angle, length, width, color, tail = 20) {
        dial.save();
        dial.rotate(angle);
        dial.strokeStyle = color;
        dial.lineWidth = width;
        dial.lineCap = "round";
        dial.beginPath();
        dial.moveTo(0, tail);
        dial.lineTo(0, -length);
        dial.stroke();
        dial.restore();
      }
      hand(hours * Math.PI / 6, 172, 16, "#fff6df");
      hand(minutes * Math.PI / 30, 235, 11, "#fff6df");
      hand(seconds * Math.PI / 30, 288, 3, "#eb493b", 49);
      dial.beginPath();
      dial.arc(0, 0, 12, 0, Math.PI * 2);
      dial.fillStyle = "#eb493b";
      dial.fill();
      dial.restore();
    }

    const locationPicker = document.getElementById("location-picker");
    const locationQuery = document.getElementById("location-query");
    const locationCountry = document.getElementById("location-country");
    const locationResults = document.getElementById("location-results");
    const locationStatus = document.getElementById("location-status");
    const searchLocationButton = document.getElementById("search-location");
    const useLocationButton = document.getElementById("use-location");
    const locationName = document.getElementById("selected-location");
    const locationRegion = document.getElementById("selected-region");
    const locationStorageKey = "tonystark.weather.location.v1";
    let selectedLocation = { latitude: 50.0755, longitude: 14.4378, name: "Praha", region: "Česko" };
    let locationIntent = 0;
    let searchController;

    function validLocation(value) {
      return value && Number.isFinite(value.latitude) && Math.abs(value.latitude) <= 90
        && Number.isFinite(value.longitude) && Math.abs(value.longitude) <= 180
        && typeof value.name === "string" && value.name.trim().length > 0 && value.name.length <= 150
        && typeof value.region === "string" && value.region.length <= 350;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(locationStorageKey));
      if (validLocation(saved)) selectedLocation = saved;
    } catch { /* Unavailable storage must not prevent weather from working. */ }
    locationName.textContent = selectedLocation.name;
    locationRegion.textContent = selectedLocation.region;
    const weatherTempEl = document.getElementById("weather-temp");
    const weatherDetailEl = document.getElementById("weather-detail");
    const weatherIconEl = document.getElementById("weather-icon");
    const weatherStatusEl = document.getElementById("weather-status");
    const refreshButton = document.getElementById("refresh-weather");
    const weatherReading = document.getElementById("weather-reading");
    let weatherRefreshTimer;
    let weatherRequestId = 0;
    let weatherController;

    function updateDateTime() {
      const now = new Date();
      const key = `${now.getMonth() + 1}-${now.getDate()}`;
      const dayName = new Intl.DateTimeFormat("cs-CZ", { weekday: "long" }).format(now);
      const stateHoliday = stateHolidays[key];
      holidayLabelEl.textContent = stateHoliday ? "Dnes je" : "Dnes má svátek";
      holidayInfoEl.textContent = stateHoliday || namedays[key] || "—";
      dayEl.textContent = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      numberEl.textContent = now.getDate();
      dateEl.textContent = new Intl.DateTimeFormat("cs-CZ", { month: "long", year: "numeric" }).format(now);
      timeEl.textContent = new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit" }).format(now);
      secondsEl.textContent = ":" + String(now.getSeconds()).padStart(2, "0");
      drawClock(now);
    }

    function fallbackSky() {
      const hour = new Date().getHours();
      scene.dataset.sky = hour < 6 || hour >= 20 ? "night" : "cloudy";
    }

    function applyWeatherAppearance(code, isDay) {
      const weather = weatherMap[code] || { text: "Neznámé podmínky", icon: "cloud" };
      const night = isDay === 0;
      weatherIconEl.src = `/assets/icons/weather/${night && code <= 1 ? "moon" : weather.icon}.svg`;
      scene.dataset.sky = night ? "night" : code <= 2 ? "clear" : "cloudy";
      return weather.text;
    }

    async function fetchWeather() {
      const { latitude, longitude, name: city } = selectedLocation;
      const requestId = ++weatherRequestId;
      weatherController?.abort();
      weatherController = new AbortController();
      const controller = weatherController;
      const timeout = setTimeout(() => controller.abort(), 12000);
      refreshButton.disabled = true;
      weatherReading.setAttribute("aria-busy", "true");
      weatherTempEl.textContent = "— °C";
      weatherDetailEl.textContent = "Načítám aktuální počasí…";
      weatherIconEl.src = "/assets/icons/weather/cloud.svg";
      weatherStatusEl.textContent = `Načítám · ${city}`;

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,is_day&timezone=auto`;
        const response = await fetch(url, {
          signal: controller.signal,
          credentials: "omit",
          referrerPolicy: "no-referrer",
          redirect: "error"
        });
        if (!response.ok) throw new Error("Nepodařilo se načíst data počasí.");
        const payload = await response.json();
        if (requestId !== weatherRequestId) return;
        const current = payload.current;
        if (!current || !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.wind_speed_10m) || !Number.isFinite(current.weather_code) || ![0, 1].includes(current.is_day)) {
          throw new Error("Data počasí jsou neúplná.");
        }
        const description = applyWeatherAppearance(current.weather_code, current.is_day);
        weatherTempEl.textContent = `${Math.round(current.temperature_2m)} °C`;
        weatherDetailEl.textContent = `${description} · vítr ${Math.round(current.wind_speed_10m)} km/h`;
        // API time is already local to the selected city.
        const updatedAt = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/.exec(current.time)?.[1];
        weatherStatusEl.textContent = updatedAt ? `${city} · data z ${updatedAt}` : `${city} · aktuální data`;
      } catch (error) {
        if (requestId !== weatherRequestId) return;
        weatherTempEl.textContent = "— °C";
        weatherDetailEl.textContent = "Počasí se nepodařilo načíst.";
        weatherIconEl.src = "/assets/icons/weather/warning-circle.svg";
        weatherStatusEl.textContent = "Zkus počasí obnovit za chvíli.";
        fallbackSky();
      } finally {
        clearTimeout(timeout);
        if (requestId === weatherRequestId) {
          refreshButton.disabled = false;
          weatherReading.setAttribute("aria-busy", "false");
        }
      }
    }

    function cancelLocationRequest() {
      locationIntent++;
      searchController?.abort();
      searchLocationButton.disabled = false;
      useLocationButton.disabled = false;
      locationResults.replaceChildren();
      locationResults.removeAttribute("aria-busy");
    }

    function chooseLocation(place, fromDevice = false) {
      if (!validLocation(place)) return;
      cancelLocationRequest();
      selectedLocation = place;
      locationName.textContent = place.name;
      locationRegion.textContent = place.region;
      try {
        const saved = fromDevice ? { ...place, name: "Uložená poloha", region: "Poslední zjištěná poloha zařízení" } : place;
        localStorage.setItem(locationStorageKey, JSON.stringify(saved));
      } catch { /* The current selection still works without storage. */ }
      locationPicker.open = false;
      locationPicker.querySelector("summary").focus();
      locationStatus.textContent = "Napiš název dalšího místa a klepni na Hledat.";
      fetchWeather();
    }

    function resetLocationSearch() {
      cancelLocationRequest();
      locationStatus.textContent = "Napiš alespoň 2 znaky. Hledat můžeš i bez háčků a čárek.";
    }

    async function searchLocations() {
      cancelLocationRequest();
      const query = locationQuery.value.trim();
      if (query.length < 2) {
        locationStatus.textContent = "Napiš alespoň 2 znaky z názvu města nebo obce.";
        locationQuery.focus();
        return;
      }
      const intent = locationIntent;
      const controller = new AbortController();
      searchController = controller;
      const timeout = setTimeout(() => controller.abort(), 12000);
      searchLocationButton.disabled = true;
      locationResults.setAttribute("aria-busy", "true");
      locationStatus.textContent = "Hledám místa…";
      try {
        const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
        url.search = new URLSearchParams({ name: query.slice(0, 100), count: "50", language: "cs", format: "json" });
        if (["CZ", "SK"].includes(locationCountry.value)) url.searchParams.set("countryCode", locationCountry.value);
        const response = await fetch(url, { signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer", redirect: "error" });
        if (!response.ok) throw new Error("Location search failed");
        const payload = await response.json();
        if (intent !== locationIntent) return;
        if (payload.error || (payload.results !== undefined && !Array.isArray(payload.results))) throw new Error("Invalid search results");
        const places = (payload.results || []).slice(0, 50).map(place => ({
          latitude: place.latitude, longitude: place.longitude, name: place.name,
          region: [...new Set([place.admin2, place.admin1, place.country].filter(part => typeof part === "string" && part && part !== place.name))].join(" · ")
        })).filter(validLocation);
        for (const place of places) {
          const item = document.createElement("li");
          const button = document.createElement("button");
          button.type = "button";
          const name = document.createElement("strong");
          name.textContent = place.name;
          const region = document.createElement("span");
          region.textContent = place.region || "Vybrat toto místo";
          button.append(name, region);
          button.addEventListener("click", () => chooseLocation(place));
          item.append(button);
          locationResults.append(item);
        }
        locationStatus.textContent = places.length
          ? `Vyber správné místo níže (${places.length}).${places.length === 50 ? " Pro přesnější výběr dopiš delší název nebo oblast za čárku." : ""}`
          : "Žádné místo nenalezeno. Zkus jiný název nebo přepni na Celý svět.";
      } catch {
        if (intent === locationIntent) locationStatus.textContent = "Místa se nepodařilo načíst. Zkontroluj připojení a zkus Hledat znovu.";
      } finally {
        clearTimeout(timeout);
        if (intent === locationIntent) {
          searchLocationButton.disabled = false;
          locationResults.removeAttribute("aria-busy");
        }
      }
    }

    function useDeviceLocation() {
      cancelLocationRequest();
      if (!navigator.geolocation) {
        locationStatus.textContent = "Polohu tu nelze zjistit. Vyhledej město nebo obec podle názvu.";
        return;
      }
      const intent = locationIntent;
      useLocationButton.disabled = true;
      locationStatus.textContent = "Čekám na polohu. Pokud se prohlížeč zeptá, povol její použití.";
      function failed(error) {
        if (intent !== locationIntent) return;
        useLocationButton.disabled = false;
        locationStatus.textContent = error?.code === 1
          ? "Poloha není povolená. Můžeš ji povolit v nastavení webu, nebo vyhledat místo podle názvu."
          : "Polohu se nepodařilo zjistit. Zkus to znovu, nebo vyhledej místo podle názvu.";
      }
      try {
        navigator.geolocation.getCurrentPosition(position => {
          if (intent !== locationIntent) return;
          const place = {
            latitude: Math.round(position.coords.latitude * 100) / 100,
            longitude: Math.round(position.coords.longitude * 100) / 100,
            name: "Moje poloha", region: "Přibližná poloha zařízení"
          };
          if (!validLocation(place)) { failed(); return; }
          chooseLocation(place, true);
        }, failed, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
      } catch { failed(); }
    }

    locationQuery.addEventListener("input", resetLocationSearch);
    locationCountry.addEventListener("change", resetLocationSearch);
    locationQuery.addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); searchLocations(); }
    });
    searchLocationButton.addEventListener("click", searchLocations);
    useLocationButton.addEventListener("click", useDeviceLocation);
    refreshButton.addEventListener("click", fetchWeather);
    fallbackSky();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    fetchWeather();
    weatherRefreshTimer = setInterval(fetchWeather, 10 * 60 * 1000);
    window.addEventListener("beforeunload", () => clearInterval(weatherRefreshTimer));

(function () {
  const PRODUCTION_HOSTS = new Set([
    "cardenasyasociados.com.ar",
    "www.cardenasyasociados.com.ar",
  ]);
  const isProduction = PRODUCTION_HOSTS.has(window.location.hostname);
  window.CYA_IS_PRODUCTION = isProduction;

  // The same GTM container is used, but localhost never sends analytics data.
  if (isProduction) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-P9BRX6NS";
    document.head.appendChild(script);
  }

  const formatNow = () => {
    const date = new Date();
    const pad = (number) => String(number).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const standardMessage = (gclid, time) => {
    const tracking = gclid && time
      ? ` My automatic enquiry code is: GCLID ${gclid}; TIME ${time}. [Please do not delete].`
      : "";
    return `Hello! *EN* — I am contacting Cárdenas & Associates through the English-language website.${tracking} I need advice about a legal matter connected to Argentina. Please note: you may receive an automatic reply in Spanish, but you can write or send a voice message in English. The lawyer will reply in English. My enquiry is: `;
  };

  const params = new URLSearchParams(window.location.search);
  const incomingGclid = params.get("gclid");
  if (incomingGclid) {
    localStorage.setItem("cya_en_gclid", incomingGclid);
    localStorage.setItem("cya_en_gclid_time", formatNow());
  }

  const applyEnglishWhatsAppMessage = () => {
    const gclid = localStorage.getItem("cya_en_gclid");
    const time = localStorage.getItem("cya_en_gclid_time");
    const text = encodeURIComponent(standardMessage(gclid, time));
    document
      .querySelectorAll('a[href*="wa.me"],a[href*="api.whatsapp.com"]')
      .forEach((link) => {
        const href = link.getAttribute("href") || "";
        const match = href.match(/(?:phone=|\/)([0-9]{10,15})/);
        const phone = match ? match[1] : "5491131166233";
        link.href = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
      });
  };

  applyEnglishWhatsAppMessage();
  window.addEventListener("load", applyEnglishWhatsAppMessage);

  // Run immediately before navigation so an older GTM HTML tag cannot replace
  // the English message while the Google Ads click trigger still sees WhatsApp.
  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest('a[href*="wa.me"],a[href*="api.whatsapp.com"]');
      if (!link) return;
      applyEnglishWhatsAppMessage();
    },
    true,
  );
})();

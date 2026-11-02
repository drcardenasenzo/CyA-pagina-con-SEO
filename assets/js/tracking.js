
(function(){
  const PRODUCTION_HOSTS=new Set(['cardenasyasociados.com.ar','www.cardenasyasociados.com.ar']);
  const isProduction=PRODUCTION_HOSTS.has(window.location.hostname);
  window.CYA_IS_PRODUCTION=isProduction;

  // GTM se carga solamente en el dominio real. Así localhost no contamina Google Ads/Analytics.
  if(isProduction){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    const s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtm.js?id=GTM-P9BRX6NS'; document.head.appendChild(s);
  }

  function formatNow(){
    const d=new Date(); const p=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  const areas=[
    ['/amparos-de-salud/','SALUD','Amparos de Salud','Necesito asesoramiento porque mi obra social o prepaga:'],
    ['/ejecuciones-fiscales-arca/','ARCA','Ejecuciones Fiscales de ARCA','Recibí una intimación, demanda o embargo y necesito asesoramiento sobre:'],
    ['/laboral-trabajadores/','TRAB','Derecho Laboral para Trabajadores','Necesito asesoramiento por un conflicto laboral sobre:'],
    ['/concursos-y-quiebras/','CONC','Concursos y Quiebras','Necesito asesoramiento sobre:'],
    ['/defensa-consumidor/','CONS','Defensa del Consumidor','Necesito asesoramiento por un reclamo de consumo sobre:'],
    ['/patrimonial/','PATR','Contratos, Desalojos y Trámites','Quisiera consultar por:'],
    ['/penal/','PENAL','Derecho Penal en CABA','Necesito asesoramiento por:'],
    ['/previsional/','PREV','Derecho Previsional','Quisiera consultar por:'],
    ['/accidentes-laborales/','ART','Accidentes Laborales y ART','Necesito asesoramiento por un accidente o enfermedad laboral:'],
    ['/accidentes-transito/','TRANS','Accidentes de Tránsito','Necesito asesoramiento por un accidente con lesiones:']
  ];
  const area=areas.find(([path])=>location.pathname.startsWith(path))||['/','FAM','Derecho de Familia','Necesito asesoramiento sobre lo siguiente:'];

  function updateWhatsAppLinks(gclid,time){
    const tracking=gclid&&time?` Mi código automático de consulta es: GCLID ${gclid}; TIME ${time}. [Por favor, no borrar].`:'';
    const raw=`¡Hola! *${area[1]}* — Me contacto desde ${area[2]} de Cárdenas & Asociados.${tracking} ${area[3]} `;
    const text=encodeURIComponent(raw);
    document.querySelectorAll('a[href*="wa.me"],a[href*="api.whatsapp.com"]').forEach(link=>{
      const href=link.getAttribute('href')||''; const m=href.match(/(?:phone=|\/)([0-9]{10,15})/); const phone=m?m[1]:'5491131166233';
      const next=`https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
      if(link.href!==next)link.href=next;
    });
  }
  const params=new URLSearchParams(location.search); const incoming=params.get('gclid');
  if(incoming){localStorage.setItem('cya_gclid',incoming);localStorage.setItem('cya_gclid_time',formatNow())}
  const gclid=localStorage.getItem('cya_gclid'); const time=localStorage.getItem('cya_gclid_time');
  updateWhatsAppLinks(gclid,time);
  window.addEventListener('load',()=>updateWhatsAppLinks(gclid,time));
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href*="wa.me"],a[href*="api.whatsapp.com"]');
    if(link)updateWhatsAppLinks(gclid,time);
  },true);
  new MutationObserver(changes=>{
    if(changes.some(change=>change.type==='childList'||change.target.matches?.('a[href*="wa.me"],a[href*="api.whatsapp.com"]')))
      updateWhatsAppLinks(gclid,time);
  }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
})();

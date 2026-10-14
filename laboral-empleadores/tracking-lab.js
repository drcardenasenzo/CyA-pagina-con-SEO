
(function(){
  if(!location.pathname.startsWith('/laboral-empleadores/'))return;
  const PRODUCTION_HOSTS=new Set(['cardenasyasociados.com.ar','www.cardenasyasociados.com.ar']);
  const isProduction=PRODUCTION_HOSTS.has(window.location.hostname);
  window.CYA_IS_PRODUCTION=isProduction;

  // GTM se carga solamente en el dominio real. Así localhost no contamina Google Ads/Analytics.
  if(isProduction){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    const s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtm.js?id=GTM-NR759R97'; document.head.appendChild(s);
  }

  function formatNow(){
    const d=new Date(); const p=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  function updateWhatsAppLinks(gclid,time){
    const raw=`¡Hola! *LAB* — Me contacto desde Laboral Empleadores de Cárdenas & Asociados. Recibí un reclamo laboral y necesito asesoramiento. Mi código automático de consulta es: GCLID ${gclid}; TIME ${time}. [Por favor, no borrar]. Necesito asesoramiento sobre lo siguiente: `;
    const text=encodeURIComponent(raw);
    document.querySelectorAll('a[href*="wa.me"],a[href*="api.whatsapp.com"]').forEach(link=>{
      const href=link.getAttribute('href')||''; const m=href.match(/(?:phone=|\/)([0-9]{10,15})/); const phone=m?m[1]:'5491131166233';
      link.href=`https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
    });
  }
  const params=new URLSearchParams(location.search); const incoming=params.get('gclid');
  const storedAt=Number(localStorage.getItem('cya_lab_saved_at')||0);
  if(storedAt && Date.now()-storedAt>90*24*60*60*1000){localStorage.removeItem('cya_lab_gclid');localStorage.removeItem('cya_lab_gclid_time')}
  if(incoming){localStorage.setItem('cya_lab_saved_at',String(Date.now()));localStorage.setItem('cya_lab_gclid',incoming);localStorage.setItem('cya_lab_gclid_time',formatNow())}
  const gclid=localStorage.getItem('cya_lab_gclid'); const time=localStorage.getItem('cya_lab_gclid_time');
  if(gclid&&time)updateWhatsAppLinks(gclid,time);
  document.addEventListener('click',function(event){
    const link=event.target.closest?.('a[href]');
    if(!link)return;
    let url;try{url=new URL(link.href)}catch(e){return}
    if(url.hostname!=='wa.me' && url.hostname!=='api.whatsapp.com')return;
    if(isProduction){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'cya_lab_whatsapp',area:'LAB'})}
  });
})();

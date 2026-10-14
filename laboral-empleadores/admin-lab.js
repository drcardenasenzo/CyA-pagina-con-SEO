
(function(){
  if(!location.pathname.startsWith('/laboral-empleadores/'))return;
  const modal=document.getElementById('adminAccess'); const panel=document.getElementById('adminPanel'); const toast=document.getElementById('toast');
  if(!modal||!panel)return;
  const ADMIN_PIN='4405';
  const GOOGLE_SCRIPT_URL='https://script.google.com/macros/s/AKfycbzjl61leVYmFevtdHqAZsIQ2-Wvonug3sstVif6LuqyNgqlBNfiIORCLHo1AC1cSsZV/exec';
  function show(msg,error=false){if(!toast)return;toast.textContent=msg;toast.style.background=error?'#FEE2E2':'#DCFCE7';toast.style.color=error?'#991B1B':'#166534';toast.style.display='block';setTimeout(()=>toast.style.display='none',4000)}
  window.solicitarAccesoAdmin=function(e){if(e)e.preventDefault();modal.style.display='flex';modal.querySelectorAll('input').forEach(i=>i.value='');modal.querySelector('input')?.focus()};
  window.cerrarPinModal=function(){modal.style.display='none'};
  window.cerrarAdminPanel=function(){panel.style.display='none'};
  const pins=[...modal.querySelectorAll('input')];
  pins.forEach((input,i)=>input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,1);if(input.value&&pins[i+1])pins[i+1].focus();if(pins.every(p=>p.value))validate()}));
  function validate(){const p=pins.map(i=>i.value).join('');if(p===ADMIN_PIN){modal.style.display='none';panel.style.display='flex'}else{show('PIN incorrecto.',true);modal.style.display='none'}}
  document.getElementById('adminEnter')?.addEventListener('click',validate);
  document.getElementById('adminCloseAccess')?.addEventListener('click',()=>modal.style.display='none');
  document.getElementById('adminClosePanel')?.addEventListener('click',()=>panel.style.display='none');
  document.getElementById('adminSend')?.addEventListener('click',async()=>{
    const raw=document.getElementById('capiPasteInput').value.trim();
    if(!/\bLAB\b/.test(raw)){show('Pegá un mensaje identificado con LAB. Este panel es exclusivo de Laboral Empleadores.',true);return}
    const g=raw.match(/GCLID\s*[:=\s_\*]*([a-zA-Z0-9\-_]{15,})/i)?.[1];
    const t=raw.match(/TIME\s*[:=\s_\*]*([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}:[0-9]{2})/i)?.[1];
    if(!g||!t){show('No se detectó un GCLID o TIME válido.',true);return}
    if(!window.CYA_IS_PRODUCTION){show('Modo local: la conversión NO fue enviada. En producción se habilita automáticamente.');return}
    try{show('Enviando conversión...');await fetch(GOOGLE_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({gclid:g,time:t,area:"LAB"})});show('Conversión enviada con éxito.');document.getElementById('capiPasteInput').value='';panel.style.display='none'}catch(e){show('Error de red al enviar la conversión.',true)}
  });
})();

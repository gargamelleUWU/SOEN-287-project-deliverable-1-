// Unified site script (based on Abdul's script.js)
(function(){
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  document.querySelectorAll('.more').forEach(function(dropdown){
    const btn = dropdown.querySelector('.more-btn'); if (!btn) return;
    btn.addEventListener('click', function(e){ e.stopPropagation(); dropdown.classList.toggle('open'); });
    document.addEventListener('click', function(e){ if (!dropdown.contains(e.target)) dropdown.classList.remove('open'); });
  });
  const form = document.getElementById('form');
  if (form) {
    const sections = Array.from(document.querySelectorAll('.s')); let currentStep = 0;
    function showStep(i){ sections.forEach((s,idx)=> s.hidden = idx !== i); currentStep = i;
      document.querySelectorAll('.p-step').forEach((dot, idx)=>{ dot.classList.toggle('is-done', idx <= currentStep); });
    }
    showStep(0);
    form.addEventListener('click', function(e){
      if (e.target.closest('.next')) {
        const req = sections[currentStep].querySelectorAll('[required]'); let ok = true;
        for (let i=0;i<req.length;i++){ if(!req[i].value){ req[i].focus(); ok=false; break; } }
        if (ok) showStep(Math.min(currentStep+1, sections.length-1));
      }
      if (e.target.closest('.back')) showStep(Math.max(currentStep-1, 0));
    });
    form.addEventListener('submit', function(e){ e.preventDefault();
      alert('Booked!'); showStep(0); form.reset();
    });
  }
})();
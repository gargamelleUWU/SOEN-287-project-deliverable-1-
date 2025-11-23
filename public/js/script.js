// Unified site script (based on Abdul's script.js)
(function () {
  // --- Set Year ---
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // --- Dropdown Logic (UPDATED) ---
  // 1. Find ALL dropdowns (user and admin) by selecting both classes
  const allDropdowns = document.querySelectorAll('.more, .adminmore');

  // 2. Loop through them to attach the *toggle* buttons
  allDropdowns.forEach(function (dropdown) {
    const btn = dropdown.querySelector('.more-btn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // Stop this click from bubbling up to the 'document'

      // Get the current state
      const isOpen = dropdown.classList.contains('open');

      // First, close ALL dropdowns
      allDropdowns.forEach(function (d) {
        d.classList.remove('open');
      });

      // If the one clicked was *not* open, open it.
      // This makes it toggle-able (click to open, click to close)
      if (!isOpen) {
        dropdown.classList.add('open');
      }
    });
  });

  // 3. Add *one single* 'click-off' listener to the whole document
  document.addEventListener('click', function (e) {
    // We need to check if the click was *inside* one of the dropdowns
    let clickedInsideADropdown = false;
    allDropdowns.forEach(function (dropdown) {
      // Check if the click target is the dropdown or inside the dropdown
      if (dropdown.contains(e.target)) {
        clickedInsideADropdown = true;
      }
    });

    // If the click was *outside* all dropdowns, close them all.
    if (!clickedInsideADropdown) {
      allDropdowns.forEach(function (dropdown) {
        dropdown.classList.remove('open');
      });
    }
  });
  // --- End of Updated Dropdown Logic ---


  // --- Stepper Form Logic (Unchanged) ---
  const form = document.getElementById('form');
  if (form) {
    const sections = Array.from(document.querySelectorAll('.s'));
    let currentStep = 0;

    function showStep(i) {
      sections.forEach((s, idx) => s.hidden = idx !== i);
      currentStep = i;
      document.querySelectorAll('.p-step').forEach((dot, idx) => {
        dot.classList.toggle('is-done', idx <= currentStep);
      });
    }
    showStep(0);
    form.addEventListener('click', function (e) {
      if (e.target.closest('.next')) {
        const req = sections[currentStep].querySelectorAll('[required]');
        let ok = true;
        for (let i = 0; i < req.length; i++) {
          if (!req[i].value) {
            req[i].focus();
            ok = false;
            break;
          }
        }
        if (ok) showStep(Math.min(currentStep + 1, sections.length - 1));
      }
      if (e.target.closest('.back')) showStep(Math.max(currentStep - 1, 0));
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Booked!');
      showStep(0);
      form.reset();
    });
  }
})();

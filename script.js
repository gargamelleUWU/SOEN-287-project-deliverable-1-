// Set current year in footer if the element exists
if (document.getElementById('year')) {
  document.getElementById('year').textContent = new Date().getFullYear();
}

// Dropdown menu functionality
document.querySelectorAll('.more').forEach(function(dropdown) {
  const button = dropdown.querySelector('.more-btn');
  
  // Toggle dropdown when button is clicked
  button.addEventListener('click', function() {
    dropdown.classList.toggle('open');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
    }
  });
});

// Multi-step form functionality
const formSections = Array.from(document.querySelectorAll('.s'));
let currentStep = 0;

// Show specific step and hide others
function showStep(stepIndex) {
  formSections.forEach(function(section, index) {
    section.hidden = index !== stepIndex;
  });
  currentStep = stepIndex;
}

// Update progress indicator dots
function updateProgress() {
  const progressSteps = document.querySelectorAll('.p-step');
  
  progressSteps.forEach(function(step, index) {
    step.classList.toggle('is-done', index <= currentStep);
  });
}

// Initialize form to show first step
showStep(0);
updateProgress();

// Form event handling
const bookingForm = document.getElementById('form');

bookingForm.addEventListener('click', function(event) {
  // Handle Next button clicks
  if (event.target.closest('.next')) {
    const requiredFields = formSections[currentStep].querySelectorAll('[required]');
    let allValid = true;
    
    // Check if all required fields are filled
    for (let i = 0; i < requiredFields.length; i++) {
      if (!requiredFields[i].value) {
        requiredFields[i].focus();
        allValid = false;
        break;
      }
    }
    
    // If all required fields are valid, go to next step
    if (allValid) {
      const nextStep = Math.min(currentStep + 1, formSections.length - 1);
      showStep(nextStep);
      updateProgress();
    }
  }
  
  // Handle Back button clicks
  if (event.target.closest('.back')) {
    const previousStep = Math.max(currentStep - 1, 0);
    showStep(previousStep);
    updateProgress();
  }
});

// Form submission
bookingForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Show success message
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  
  // Hide toast after 2.6 seconds
  setTimeout(function() {
    toast.classList.remove('show');
  }, 2600);
  
  // Reset form and go back to first step
  showStep(0);
  updateProgress();
  bookingForm.reset();
});
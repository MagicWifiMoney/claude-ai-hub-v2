document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) {
    lucide.createIcons();
  }


  const drawerCheckbox = document.getElementById('mobile-drawer');
  const drawerSide = document.querySelector('.drawer-side');
  
  if (drawerCheckbox && drawerSide) {

    drawerSide.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' || event.target.closest('A')) {
        drawerCheckbox.checked = false;
      }
    });
  }

  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput.value.trim();

      if (email) {
        console.log(`Simulating server action: Subscribing ${email} to the newsletter and updating user record.`);
        
        newsletterFeedback.textContent = 'Thanks for subscribing!';
        newsletterFeedback.classList.remove('text-error');
        newsletterFeedback.classList.add('text-success');
        
        emailInput.value = '';

        setTimeout(() => {
          newsletterFeedback.textContent = '';
        }, 5000);
      } else {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterFeedback.classList.remove('text-success');
        newsletterFeedback.classList.add('text-error');
      }
    });
  }
});

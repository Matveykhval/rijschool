document.addEventListener('DOMContentLoaded', () => {
  const trialForm = document.getElementById('trial-form');
  const alertBox = document.getElementById('form-alert');

  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const lessonType = document.getElementById('lesson-type').value;

      if (!name || !phone) {
        showAlert('Vul alstublieft uw naam en telefoonnummer in.', 'error');
        return;
      }

      // Handle submission (placeholder or API ready)
      console.log('Proefles aanvraag verzonden:', { name, phone, lessonType });
      showAlert('Bedankt voor uw aanvraag! Wij nemen binnen 24 uur contact met u op.', 'success');
      trialForm.reset();
    });
  }

  function showAlert(msg, type) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.style.display = 'block';
    alertBox.style.padding = '12px 16px';
    alertBox.style.borderRadius = '8px';
    alertBox.style.marginBottom = '16px';
    alertBox.style.fontWeight = '500';

    if (type === 'error') {
      alertBox.style.backgroundColor = '#fee2e2';
      alertBox.style.color = '#991b1b';
      alertBox.style.border = '1px solid #fecaca';
    } else {
      alertBox.style.backgroundColor = '#dcfce7';
      alertBox.style.color = '#166534';
      alertBox.style.border = '1px solid #bbf7d0';
    }
  }
});


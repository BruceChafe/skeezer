const recipientForm = document.getElementById('recipientForm');
const sendNotificationForm = document.getElementById('sendNotificationForm');
const newRecipientInput = document.getElementById('newRecipientInput');
const recipientList = document.getElementById('recipients');
const resultSection = document.getElementById('resultSection');

const recipients = [];

function addRecipient(phoneNumber) {
  recipients.push(phoneNumber);
  const newListItem = document.createElement('li');
  newListItem.innerText = phoneNumber;
  recipientList.appendChild(newListItem);
}

function clearForm(form) {
  // only clearing the passcode and leaving the message for convience
  form.passcode.value = '';
}

recipientForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (newRecipientInput.value) {
    addRecipient(newRecipientInput.value);
    newRecipientInput.value = '';
  }
});

function sendMessages(form) {
  const data = {
    passcode: form.passcode.value,
    message: form.message.value,
    recipients: recipients.join(','),
  };

  clearForm(form);

  fetch("/path-to/send-message.js", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((resp) => {
    if (resp.ok) {
      return resp.text(); // Handle the response as text
    }
  
    if (resp.status === 401) {
      throw new Error('Invalid Passcode');
    } else {
      throw new Error(
        'Unexpected error. Please check the logs for what went wrong.'
      );
    }
  })
  .then((responseText) => {
    try {
      const responseObject = JSON.parse(responseText); // Parse the response as JSON
      // Handle the responseObject here
    } catch (error) {
      resultSection.innerText = 'Invalid JSON response from the server';
    }
  })
  .catch((err) => {
    resultSection.innerText = err.message;
  });
  
}

sendNotificationForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (recipients.length === 0 && newRecipientInput.value) {
    addRecipient(newRecipientInput.value);
    newRecipientInput.value = '';
  }

  if (recipients.length === 0) {
    resultSection.innerText = 'Please enter at least one phone number';
  } else {
    resultSection.innerText = 'Sending messages. One moment';
    sendMessages(evt.target);
  }
});

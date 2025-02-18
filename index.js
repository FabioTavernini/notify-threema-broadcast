const core = require('@actions/core');
const axios = require('axios');

try {
  // Retrieve secrets from GitHub Secrets (configured in the repository)
  const XApiKey = core.getInput('THREEMA_XAPIKEY');  // Secret API Key
  const threemaUrl = core.getInput('THREEMA_URL');  // Full URL to send the message (with identity/group)
  const message = core.getInput('message');  // Message body

  if (!XApiKey || !threemaUrl || !message) {
    throw new Error('Missing required input parameters or secrets');
  }

  // Message payload
  const payload = {
    type: 'text',  // Message type
    body: message,  // Message body content
  };

  // Send the POST request to Threema API
  axios.post(threemaUrl, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': XApiKey,  // Correct header format for Threema API
    },
  })
    .then(response => {
      console.log(`Message sent successfully: ${response.data}`);
    })
    .catch(error => {
      console.error(`Error sending message: ${error}`);
      core.setFailed(error.message);
    });

  // Output the current time (for demonstration)
  const time = (new Date()).toTimeString();
  core.setOutput('time', time);

} catch (error) {
  core.setFailed(error.message);
}

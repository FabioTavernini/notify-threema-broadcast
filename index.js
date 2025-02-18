const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

try {
  // Retrieve secrets from GitHub Secrets (configured in the repository)
  const XApiKey = core.getInput('THREEMA_XAPIKEY');
  const threemaUrl = core.getInput('THREEMA_URL');
  const message = core.getInput('message');

  if (!XApiKey || !threemaUrl || !message) {
    throw new Error('Missing required input parameters or secrets');
  }

  // Message payload
  const payload = {
    type: 'text',
    body: message,
  };

  // Send the POST request to Threema API
  axios.post(threemaUrl, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': XApiKey,
    },
  })
    .then(response => {
      console.log(`Message sent successfully: ${response.data}`);
    })
    .catch(error => {
      console.error(`Error sending message: ${error}`);
      core.setFailed(error.message);
    });

  // Output the current time
  const time = (new Date()).toTimeString();
  core.setOutput('time', time);

} catch (error) {
  core.setFailed(error.message);
}

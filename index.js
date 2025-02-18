const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

try {
  // Retrieve secrets from GitHub Secrets (configured in the repository)
  const apiKey = process.env.X_API_KEY;  // Retrieving the API key from environment variables (secrets)
  const threemaUrl = process.env.THREEMA_URL;  // Retrieving the Threema API URL

  // Get inputs from the GitHub Action
  const group = core.getInput('group');
  const identity = core.getInput('identity');
  const message = core.getInput('message');

  if (!apiKey || !threemaUrl || !group || !identity || !message) {
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
      'X-API_Key': apiKey,
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

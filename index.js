const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    // Retrieve inputs from GitHub Action
    const xApiKey = core.getInput('THREEMA_XAPIKEY');
    const threemaUrl = core.getInput('THREEMA_URL');
    const message = core.getInput('message');

    // Message payload
    const payload = {
      type: 'text',
      body: message,
    };

    // Send the POST request to Threema API
    try {
      const response = await axios.post(threemaUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': xApiKey,
        },
      });

      // Log success and set output
      console.log('Message sent successfully');
      core.setOutput('response', response.data);
      core.setOutput('status', response.status);
    } catch (apiError) {
      // Handle API-specific errors
      const errorMessage = apiError.response
        ? `API Error: ${apiError.response.status} - ${JSON.stringify(apiError.response.data)}`
        : `Network Error: ${apiError.message}`;
      
      throw new Error(errorMessage);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

// Execute the action
run();
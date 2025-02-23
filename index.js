const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    // Retrieve inputs from GitHub Action
    const xApiKey = core.getInput('THREEMA_XAPIKEY');
    const threemaUrl = core.getInput('THREEMA_URL');
    const job = JSON.parse(core.getInput('job'));
    const message = core.getInput('message');

    const { repo, workflow, ref, sha } = github.context;
    const workflowName = workflow;
    const repoName = `${repo.owner}/${repo.repo}`;
    const branch = ref.replace('refs/heads/', '');
    const commitSha = sha.substring(0, 7); // Short SHA 

    switch (job.status) {
      case "success":
        jobstatus = '✅ ' + job.status;
        break;
      case "failure":
        jobstatus = '❌ ' + job.status;
        break;
      case "cancelled":
        jobstatus = '🛑 ' + job.status;
        break;
      default:
        jobstatus = '❓ ' + job.status;
    }

    const formattedMessage = `
${message}
    
🔔 *GitHub Action Update*

👨‍💻 *Repository*
${repoName}

🌱 *Branch*
${branch}

🔄 *Workflow*
${workflowName}

⁉️ *Status*
${jobstatus}

🔍 *Commit sha*
${commitSha}`;

    // Message payload
    const payload = {
      type: 'text',
      body: formattedMessage,
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

module.exports = { run };
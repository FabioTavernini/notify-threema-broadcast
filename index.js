const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const { Octokit } = require('@octokit/rest'); // GitHub API client

// Initialize GitHub client
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


async function run() {
  try {
    // Retrieve inputs from GitHub Action
    const xApiKey = core.getInput('THREEMA_XAPIKEY');
    const threemaUrl = core.getInput('THREEMA_URL');
    const message = core.getInput('message');

    const { repo, workflow, ref, sha } = github.context;
    const workflowName = workflow;
    const repoName = `${repo.owner}/${repo.repo}`;
    const branch = ref.replace('refs/heads/', '');
    const commitSha = sha.substring(0, 7); // Short SHA 



    // Fetch the current workflow run's status using the GitHub API
    const runId = github.context.runId;
    const { data: runData } = await octokit.actions.getWorkflowRun({
      owner: repo.owner,
      repo: repo.repo,
      run_id: runId,
    });

    // Find the status of the current job
    // const jobStatus = runData.status; // "queued", "in_progress", or "completed"
    const conclusion = runData.conclusion; // "success", "failure", etc.

    let formattedJobStatus = '❓ Unknown Status';
    if (conclusion === 'success') {
      formattedJobStatus = '✅ Success';
    } else if (conclusion === 'failure') {
      formattedJobStatus = '❌ Failure';
    } else if (conclusion === 'cancelled') {
      formattedJobStatus = '🛑 Cancelled';
    } else if (conclusion === 'skipped') {
      formattedJobStatus = '⏩ Skipped';
    }


    const formattedMessage = `
${message}
    
🔔 GitHub Action Update

👨‍💻 Repository
${repoName}

🌱 Branch
${branch}

Workflow
${workflowName}

Status
${formattedJobStatus}

Commit sha
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
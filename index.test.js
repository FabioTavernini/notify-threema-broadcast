const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const { run } = require('./index'); // Adjust path as needed

// Mock all external dependencies
jest.mock('@actions/core');
jest.mock('@actions/github');
jest.mock('axios');

describe('GitHub Action Tests', () => {
  // Setup default mock values
  const mockInputs = {
    'THREEMA_XAPIKEY': 'test-api-key',
    'THREEMA_URL': 'https://api.threema.ch/send',
    'job': JSON.stringify({ status: 'success' }),
    'message': 'Test message'
  };

  const mockGithubContext = {
    repo: {
      owner: 'testowner',
      repo: 'testrepo'
    },
    workflow: 'Test Workflow',
    ref: 'refs/heads/main',
    sha: '1234567890abcdef'
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup core.getInput mock
    core.getInput.mockImplementation(name => mockInputs[name]);

    // Setup github.context
    github.context = mockGithubContext;

    // Setup successful axios response by default
    axios.post.mockResolvedValue({
      status: 200,
      data: { success: true }
    });
  });

  test('successful message sending', async () => {
    await run();

    // Verify API call
    expect(axios.post).toHaveBeenCalledWith(
      mockInputs.THREEMA_URL,
      expect.objectContaining({
        type: 'text',
        body: expect.stringContaining('Test message')
      }),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': mockInputs.THREEMA_XAPIKEY
        }
      })
    );

    // Verify outputs were set
    expect(core.setOutput).toHaveBeenCalledWith('response', { success: true });
    expect(core.setOutput).toHaveBeenCalledWith('status', 200);
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('message formatting with different job statuses', async () => {
    const testCases = [
      { status: 'success', expected: '✅ success' },
      { status: 'failure', expected: '❌ failure' },
      { status: 'cancelled', expected: '🛑 cancelled' },
      { status: 'unknown', expected: '❓ unknown' }
    ];

    for (const testCase of testCases) {
      jest.clearAllMocks();
      core.getInput.mockImplementation(name => 
        name === 'job' ? JSON.stringify({ status: testCase.status }) : mockInputs[name]
      );

      await run();

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(testCase.expected)
        }),
        expect.any(Object)
      );
    }
  });

  test('API error handling', async () => {
    const errorResponse = {
      response: {
        status: 400,
        data: { error: 'Bad Request' }
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('API Error: 400')
    );
  });

  test('network error handling', async () => {
    const networkError = new Error('Network Error');
    axios.post.mockRejectedValue(networkError);

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Network Error')
    );
  });

  test('message includes all required fields', async () => {
    await run();

    const callPayload = axios.post.mock.calls[0][1];
    const messageBody = callPayload.body;

    // Verify all required fields are present
    expect(messageBody).toContain('testowner/testrepo'); // Repository
    expect(messageBody).toContain('main'); // Branch
    expect(messageBody).toContain('Test Workflow'); // Workflow name
    expect(messageBody).toContain('1234567'); // Short SHA
    expect(messageBody).toContain('Test message'); // Custom message
  });

  test('invalid inputs handling', async () => {
    // Test with invalid JSON in job input
    core.getInput.mockImplementation(name => 
      name === 'job' ? 'invalid-json' : mockInputs[name]
    );

    await run();

    expect(core.setFailed).toHaveBeenCalled();
  });
});
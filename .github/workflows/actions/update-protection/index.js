const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    // Inputs
    const repository = core.getInput('repository');
    const template = core.getInput('template');
    const [owner, repo] = repository.split('/');

    // Read mapping file
    const mappingFilePath = '.github/mappings/mapping.json';
    const mappingData = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8'));

    // Get the properties to update
    const templateConfig = mappingData[template];
    if (!templateConfig) {
      throw new Error(`Template ${template} not found in mapping file.`);
    }

    // GitHub client
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

    // Get current branch protection rules
    const { data: protection } = await octokit.rest.repos.getBranchProtection({
      owner,
      repo,
      branch: 'main' // Change to the protected branch if different
    });

    // Remove status check
    if (templateConfig.statusCheck === 'optional') {
      await octokit.rest.repos.updateBranchProtection({
        owner,
        repo,
        branch: 'main',
        required_status_checks: null // This effectively removes the required status checks
      });
    }

    core.info(`Successfully updated branch protection for ${repository} using template ${template}.`);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();

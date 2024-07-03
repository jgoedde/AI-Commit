const simpleGit = require('simple-git');
const axios = require('axios');
const path = require('path');
const util = require('util');

// Function to get the git diff
async function getGitDiff(repoPath) {
    const git = simpleGit(repoPath);
    try {
        const diff = await git.diff();
        return diff;
    } catch (error) {
        console.error('Error getting git diff:', error);
        return null;
    }
}

// Function to generate ChatGPT prompt
function generateChatGPTPrompt(diff) {
    return `Avoid overly verbose descriptions or unnecessary details. Start with a short sentence in imperative form, no more than 50 characters long. Make sure to prefix the first sentence with a suitable gitmoji.
    Then leave an empty line and continue with a more detailed explanation. Write only one sentence for the first part, and two or thee sentences at most for the detailed explanation. 
    This is the git diff:

\`\`\`
${diff}
\`\`\``;
}

// Function to send request to OpenAI
async function getCommitMessageFromOpenAI(prompt) {
    try {
        const response = await axios.post(
            'https://run.chayns.codes/8e489003',
            {
                prompt: prompt,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const commitMessage = response.data.aiRes.trim();
        return commitMessage;
    } catch (error) {
        console.error('Error getting commit message from OpenAI:', error);
        return null;
    }
}

// Main function to get the diff and generate the commit message
async function generateCommitMessage(repoPath) {
    const diff = await getGitDiff(repoPath);
    if (!diff) {
        console.error('Failed to get git diff.');
        return;
    }

    const prompt = generateChatGPTPrompt(diff);
    const commitMessage = await getCommitMessageFromOpenAI(prompt);

    if (commitMessage) {
        // Clean up commit message: remove single quotes and newline characters
        const cleanedCommitMessage = commitMessage.replace(/'/g, '').replace(/\n/g, '\n');

        // Copy cleaned commit message to clipboard
        require('child_process').spawn('clip').stdin.end(cleanedCommitMessage);

        // Print cleaned commit message without single quotes
        console.log('Generated Commit Message:', cleanedCommitMessage + "\n\nCopied to clipboard.");
    } else {
        console.error('Failed to generate commit message.');
    }
}

// Extract the repository path from command-line arguments
const repoPath = process.argv[2];

if (!repoPath) {
    console.error('Error: Please provide the path to the Git repository as an argument.');
} else {
    // Resolve the absolute path to handle relative paths correctly
    const absolutePath = path.resolve(repoPath);
    generateCommitMessage(absolutePath);
}

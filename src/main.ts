import axios from 'axios';
import chalk from 'chalk';
import clipboard from 'clipboardy';
import path from 'node:path';
import { CleanOptions, SimpleGit, simpleGit } from 'simple-git';

const gitDiffOptions = ['--staged'];

async function getGitDiff(repoPath: string): Promise<string | null> {
    const git: SimpleGit = simpleGit(repoPath).clean(CleanOptions.FORCE);
    try {
        console.log(
            '🖹',
            chalk.white('Fetching'),
            chalk.whiteBright('git diff'),
            chalk.white('with options'),
            chalk.whiteBright(JSON.stringify(gitDiffOptions)),
            chalk.white('...'),
        );
        const s = Date.now();
        const diff = await git.diff(gitDiffOptions);
        console.log(
            '🖹',
            chalk.white('Successfully fetched git diff in'),
            chalk.whiteBright(`${Date.now() - s}ms`),
            chalk.white('with a length of'),
            chalk.whiteBright(`${diff.length} characters.`),
        );
        return diff;
    } catch (error) {
        console.log('❌ ', chalk.redBright('Error getting git diff'), chalk.whiteBright(error));
        return null;
    }
}

function generateChatGPTPrompt(diff: string): string {
    return (
        'I want you to act as the author of a commit message in git.' +
        `I'll enter a git diff, and your job is to convert it into a useful commit message in english language` +
        'Do not preface the commit with anything, use the present tense, return the full sentence, and use the conventional commits specification (<type in lowercase>: <subject>): ' +
        'Then leave an empty line and continue with a more detailed explanation. Write only one sentence for the first part, and two or thee sentences at most for the detailed explanation.' +
        diff
    );
}

async function getCommitMessageFromOpenAI(prompt: string): Promise<string> {
    try {
        console.log('⌛ ', chalk.white('Generating commit message using chayns.codes...'));

        const requestStart = Date.now();
        const response = await axios.post<{ aiRes: string }>(
            'https://run.chayns.codes/8e489003',
            {
                prompt,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log(
            '✅ ',
            chalk.white(`Received response`),
            chalk.whiteBright(response.statusText),
            chalk.white('from chayns.codes in'),
            chalk.whiteBright(`${Date.now() - requestStart}ms.`),
        );

        const data = response.data;

        const aiRes = data.aiRes;
        if (!aiRes) {
            console.log(
                '❌ ',
                chalk.redBright('An error occurred while getting the AI response. Received status'),
                chalk.whiteBright(`${response.statusText}.`),
                chalk.redBright('Is the diff too long?'),
            );
            return null;
        }
        return aiRes.trim();
    } catch (error) {
        console.log(
            '❌ ',
            chalk.redBright('An unknown error occurred while getting commit message from chayns.codes'),
            chalk.whiteBright(error),
        );
        return null;
    }
}

async function generateCommitMessage(repoPath: string): Promise<void> {
    const diff = await getGitDiff(repoPath);
    if (!diff) {
        console.log('🤷', chalk.redBright('git diff returned no results. Did you forget to stage your changes?'));
        return;
    }

    const prompt = generateChatGPTPrompt(diff);
    const commitMessage = await getCommitMessageFromOpenAI(prompt);

    if (commitMessage) {
        const cleanedCommitMessage = commitMessage.replace(/'/g, '').replace(/\n/g, '\n');

        clipboard.writeSync(cleanedCommitMessage);

        console.log('✅ ', chalk.greenBright('Successfully generated commit message and copied to clipboard'));
    } else {
        console.log('❌ ', chalk.redBright('Failed to generate commit message.'));
    }
}

const repoPath = process.argv[2];

if (!repoPath) {
    console.log('❌ ', chalk.redBright('Please provide the path to the Git repository as an argument.'));
} else {
    const absolutePath = path.resolve(repoPath);
    console.log('🏁', chalk.white('Starting commit message generation for repo'), chalk.whiteBright(absolutePath));
    void generateCommitMessage(absolutePath);
}

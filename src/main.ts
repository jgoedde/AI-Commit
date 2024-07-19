import chalk from 'chalk';
import path from 'node:path';
import { CommitCommand } from './commands/commit/CommitCommand.js';
import './commands/commit/CommitCommandListener.js';
import { GetCommitMessageFromOpenAICommand } from './commands/get-commit-message/GetCommitMessageFromOpenAICommand.js';
import './commands/get-commit-message/GetCommitMessageFromOpenAICommandListener.js';
import { GetGitDiffCommand } from './commands/get-git-diff/GetGitDiffCommand.js';
import './commands/get-git-diff/GetGitDiffCommandListener.js';

const repoPath = process.argv[2] ?? '.';

if (!repoPath) {
    console.log('❌ ', chalk.redBright('Please provide the path to the Git repository as an argument.'));
} else {
    const absolutePath = path.resolve(repoPath);
    console.log(
        '🏁',
        chalk.white('Starting commit message generation for repo'),
        chalk.whiteBright('📁', absolutePath),
    );

    // const invoker = new CommandInvoker();

    const getGitDiffCommand = new GetGitDiffCommand(absolutePath);
    const diff = await getGitDiffCommand.execute();

    if (diff.isOk()) {
        const prompt =
            'I want you to act as the author of a commit message in git.' +
            `I'll enter a git diff, and your job is to convert it into a useful commit message in english language` +
            'Do not preface the commit with anything, use the present tense, return the full sentence, and use the conventional commits specification (<type in lowercase>: <subject>): ' +
            'Then leave an empty line and continue with a more detailed explanation. Write only one sentence for the first part, and two or three sentences at most for the detailed explanation.' +
            diff;

        console.log('⌛ ', chalk.white('Generating commit message using chayns.codes...'));

        const commitMessage = await new GetCommitMessageFromOpenAICommand(prompt).execute();

        if (commitMessage.isOk()) {
            void new CommitCommand(absolutePath, commitMessage.value.message).execute();
        }
    }
}

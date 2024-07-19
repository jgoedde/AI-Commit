import chalk from 'chalk';
import path from 'node:path';
import { CommitCommand } from './commands/commit/CommitCommand.js';
import './commands/commit/CommitCommandListener.js';
import { GetCommitMessageFromOpenAICommand } from './commands/get-commit-message/GetCommitMessageFromOpenAICommand.js';
import './commands/get-commit-message/GetCommitMessageFromOpenAICommandListener.js';
import { GetGitDiffCommand } from './commands/get-git-diff/GetGitDiffCommand.js';
import './commands/get-git-diff/GetGitDiffCommandListener.js';

const repositoryPath = path.resolve(process.argv[2] ?? '.');

console.log('🏁', chalk.white('Starting commit message generation for repo'), chalk.whiteBright('📁', repositoryPath));

const getGitDiffCommandResult = await new GetGitDiffCommand(repositoryPath).execute();

if (getGitDiffCommandResult.isOk()) {
    const prompt =
        'I want you to act as the author of a commit message in git.' +
        `I'll enter a git diff, and your job is to convert it into a useful commit message in english language` +
        'Do not preface the commit with anything, use the present tense, return the full sentence, and use the conventional commits specification (<type in lowercase>: <subject>): ' +
        'Then leave an empty line and continue with a more detailed explanation. Write only one sentence for the first part, and two or three sentences at most for the detailed explanation.' +
        getGitDiffCommandResult.value.diff;

    console.log('⌛ ', chalk.white('Generating commit message using chayns.codes...'));

    const commitMessage = await new GetCommitMessageFromOpenAICommand(prompt).execute();

    if (commitMessage.isOk()) {
        void new CommitCommand(repositoryPath, commitMessage.value.message).execute();
    }
}

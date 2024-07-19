import chalk from 'chalk';
import minimist from 'minimist';
import path from 'node:path';
import { CommitCommand } from './commands/commit/CommitCommand.js';
import './commands/commit/CommitCommandListener.js';
import { GetCommitMessageFromOpenAICommand } from './commands/get-commit-message/GetCommitMessageFromOpenAICommand.js';
import './commands/get-commit-message/GetCommitMessageFromOpenAICommandListener.js';
import { GetGitDiffCommand } from './commands/get-git-diff/GetGitDiffCommand.js';
import './commands/get-git-diff/GetGitDiffCommandListener.js';
import { CommitMessageStrategyFactory } from './factories/commitMessageStrategyFactory.js';

import { cliArgsSchema } from './cliUtils/cliUtils.js';

const repositoryPath = path.resolve(process.argv[2] ?? '.');

const cliArgsParseResult = cliArgsSchema.safeParse(minimist(process.argv.slice(3)));

if (!cliArgsParseResult.success) {
    console.log('Usage:', 'node main.js <repositoryPath> [options]');
    console.log('');
    console.log('Options:');
    console.log(
        '  ',
        chalk.whiteBright('-t <type>'),
        '  Type of commit message to generate (gitmoji, gm, conventional, conv, cc). Defaults to',
        chalk.yellowBright('gitmoji'),
    );
    console.log('');
    console.log('Examples:');
    console.log('  node main.js . -t gitmoji');
    console.log('  node main.js . -t cc');
    console.log('');

    process.exit(1);
}

console.log('🏁', chalk.white('Starting commit message generation for repo'), chalk.whiteBright('📁', repositoryPath));

const getGitDiffCommandResult = await new GetGitDiffCommand(repositoryPath).execute();

if (!getGitDiffCommandResult.isOk()) {
    process.exit(1);
}

const commitType = cliArgsParseResult.data.t;

const commitMessageStrategy = CommitMessageStrategyFactory.getStrategy(commitType);

const diff = getGitDiffCommandResult.value.diff;
const prompt = commitMessageStrategy.getPrompt(diff);

console.log(
    '⌛ ',
    chalk.white(
        'Generating commit message using',
        chalk.whiteBright(CommitMessageStrategyFactory.getStrategyName(commitType), 'strategy'),
        chalk.white('...'),
    ),
);

const commitMessage = await new GetCommitMessageFromOpenAICommand(prompt).execute();

if (!commitMessage.isOk()) {
    process.exit(1);
}

void new CommitCommand(repositoryPath, commitMessage.value.message).execute();

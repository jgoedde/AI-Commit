import chalk from 'chalk';
import clipboard from 'clipboardy';
import { simpleGit } from 'simple-git';
import { Ok, Result } from 'ts-results-es';
import { askQuestion } from '../../cliUtils/cliUtils.js';
import { Command } from '../../types/Command.js';
import { eventBroker } from '../../utils/eventBroker.js';

export class CommitCommand implements Command<void> {
    private repositoryPath: string;
    private commitMessage: string;

    constructor(repoPath: string, commitMessage: string) {
        this.repositoryPath = repoPath;
        this.commitMessage = commitMessage;
    }

    public async execute(): Promise<Result<void, Error>> {
        const cleanedCommitMessage = this.commitMessage.replace(/'/g, '').replace(/\n/g, '\n');

        eventBroker.emit('commit-message-cleaned-event', cleanedCommitMessage);

        const answer = await askQuestion(
            chalk.whiteBright('Do you want to') +
                ' ' +
                chalk.greenBright('automatically commit') +
                ' ' +
                chalk.whiteBright('this message? (Y/n):'),
        );

        if ((typeof answer === 'string' && answer.toLowerCase() === 'y') || answer === '') {
            await simpleGit(this.repositoryPath).commit(cleanedCommitMessage);
            eventBroker.emit('committed-event');
        }

        if (typeof answer === 'string' && answer.toLowerCase() === 'n') {
            clipboard.writeSync(cleanedCommitMessage);
            eventBroker.emit('commit-message-copied-to-clipboard-event');
        }

        return Ok(void 0);
    }
}

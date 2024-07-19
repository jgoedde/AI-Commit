import { CleanOptions, SimpleGit, simpleGit } from 'simple-git';
import { Ok, Result } from 'ts-results-es';
import { Command } from '../../types/Command.js';
import { eventBroker } from '../../utils/eventBroker.js';

export type GitDiffResult = { diff: string; duration: number };
export type GitDiffError = Error;

export class GetGitDiffCommand implements Command<GitDiffResult> {
    private readonly gitDiffOptions = ['--staged'];

    public constructor(private readonly repositoryPath: string) {}

    public async execute(): Promise<Result<GitDiffResult, GitDiffError>> {
        eventBroker.emit('git-diff-started-event', this.gitDiffOptions);

        const git: SimpleGit = simpleGit(this.repositoryPath).clean(CleanOptions.FORCE);
        try {
            const now = Date.now();
            const diff = await git.diff(this.gitDiffOptions);
            const duration = Date.now() - now;

            const res = { diff, duration };

            eventBroker.emit('git-diff-received-event', res);

            return Ok(res);
        } catch (error) {
            eventBroker.emit('git-diff-unavailable-event', error);

            return error;
        }
    }
}

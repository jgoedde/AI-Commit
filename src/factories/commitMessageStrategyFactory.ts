import { z } from 'zod';
import { cliArgsSchema } from '../cliUtils/cliUtils.js';
import { CommitMessageStrategy } from '../strategies/commitMessageStrategy.js';
import { ConventionalCommitStrategy } from '../strategies/conventionalCommitStrategy.js';
import { GitmojiCommitStrategy } from '../strategies/gitmojiCommitStrategy.js';

/**
 * `CommitMessageStrategyFactory` is a factory class responsible for creating instances of commit message strategies
 * based on the provided commit type. It supports creating strategies for both conventional commits and gitmoji commits.
 */
export class CommitMessageStrategyFactory {
    /**
     * Returns an instance of a commit message strategy based on the provided commit type.
     *
     * @param commitType - The type of commit, derived from the CLI arguments schema. It determines which strategy instance to create.
     * @returns An instance of `CommitMessageStrategy` corresponding to the provided commit type.
     */
    public static getStrategy(commitType: z.infer<typeof cliArgsSchema>['t']): CommitMessageStrategy {
        switch (commitType) {
            case 'conventional':
            case 'cc':
            case 'conv':
                return new ConventionalCommitStrategy();

            case 'gitmoji':
            case 'gm':
                return new GitmojiCommitStrategy();
        }
    }

    /**
     * Returns the name of the commit message strategy based on the provided commit type.
     *
     * @param commitType - The type of commit, derived from the CLI arguments schema. It determines the name of the strategy.
     * @returns The name of the commit message strategy as a string.
     */
    public static getStrategyName(commitType: z.infer<typeof cliArgsSchema>['t']): string {
        switch (commitType) {
            case 'conventional':
            case 'cc':
            case 'conv':
                return 'Conventional Commits';

            case 'gitmoji':
            case 'gm':
                return 'gitmoji';
        }
    }
}

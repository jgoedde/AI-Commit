import { CommitMessageStrategyArgs } from "./main.ts";
import { CommitMessageStrategy } from "./CommitMessageStrategy.ts";
import { ConventionalCommitsStrategy } from "./ConventionalCommitsStrategy.ts";
import { GitmojiCommitStrategy } from "./GitmojiCommitStrategy.ts";

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
    public static getStrategy(
        commitType: CommitMessageStrategyArgs,
    ): CommitMessageStrategy {
        switch (commitType) {
            case "conventional-commits":
                return new ConventionalCommitsStrategy();

            case "gitmoji":
                return new GitmojiCommitStrategy();

            default:
                throw new Error(`Unknown commit type: ${commitType}`);
        }
    }
}

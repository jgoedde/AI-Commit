/**
 * Represents the strategy interface for generating commit messages.
 * This interface defines a method that must be implemented by concrete strategy classes
 * to generate commit messages based on a given git diff.
 */
export interface CommitMessageStrategy {
    /**
     * Generates a commit message prompt based on the provided git diff.
     *
     * @param diff - The git diff string used to generate the commit message prompt.
     * @returns A string representing the commit message prompt.
     */
    getPrompt(diff: string): string;
}

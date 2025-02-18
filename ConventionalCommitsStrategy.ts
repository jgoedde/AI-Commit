import { CommitMessageStrategy } from "./CommitMessageStrategy.ts";

/**
 * Implements the `CommitMessageStrategy` interface to generate commit messages
 * following the conventional commits specification based on a provided git diff.
 */
export class ConventionalCommitsStrategy implements CommitMessageStrategy {
    /**
     * Generates a commit message prompt using the conventional commits' specification.
     * The prompt instructs to act as the author of a commit message, converting a git diff
     * into a meaningful commit message in English. It emphasizes using the present tense,
     * adhering to the conventional commits format (`<type>: <subject>`), and providing
     * a detailed explanation in a specified format.
     *
     * @param diff - The git diff string used as the basis for generating the commit message prompt.
     * @returns A string representing the detailed instructions for creating a commit message
     *          based on the conventional commits specification, including the provided git diff.
     */
    public getPrompt(diff: string): string {
        return (
            "I want you to act as the author of a commit message in git." +
            `I'll enter a git diff, and your job is to convert it into a useful commit message in english language` +
            "Do not preface the commit with anything, use the present tense, return the full sentence, and use the conventional commits specification (<type in lowercase>: <subject>): " +
            "Then leave an empty line and continue with a more detailed explanation. Write only one sentence for the first part, and two or three sentences at most for the detailed explanation." +
            diff
        );
    }
}

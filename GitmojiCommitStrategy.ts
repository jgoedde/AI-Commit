import { CommitMessageStrategy } from "./CommitMessageStrategy.ts";

/**
 * Implements the `CommitMessageStrategy` interface to generate commit messages
 * following the gitmoji commit specification based on a provided git diff.
 * This strategy focuses on creating commit messages that incorporate gitmojis
 * to visually represent the type or intent of changes in a concise manner.
 */
export class GitmojiCommitStrategy implements CommitMessageStrategy {
    /**
     * Generates a commit message prompt using the gitmoji commit specification.
     * The prompt guides the author to craft a commit message that includes a suitable gitmoji
     * followed by a brief subject line. It emphasizes using the present tense and adhering to
     * the gitmoji commit format (`<suitable gitmoji> <subject>`). Additionally, it requests
     * a detailed explanation if necessary, structured in a specific format.
     *
     * @param diff - The git diff string used as the basis for generating the commit message prompt.
     * @returns A string representing the detailed instructions for creating a commit message
     *          based on the gitmoji commit specification, including the provided git diff.
     */
    public getPrompt(diff: string): string {
        return (
            "I want you to act as the author of a commit message in git." +
            `I'll enter a git diff, and your job is to convert it into a useful commit message in english language` +
            "Do not preface the commit with anything, use the present tense, return the full sentence, and use the gitmoji commit specification (<suitable gitmoji> <subject>)" +
            "Then leave an empty line and continue with a more detailed explanation. Write only one sentence for the first part, and two or three sentences at most for the detailed explanation." +
            diff
        );
    }
}

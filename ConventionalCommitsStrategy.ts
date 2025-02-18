import { CommitMessageStrategy } from "./CommitMessageStrategy.ts";

/**
 * Implements the `CommitMessageStrategy` interface to generate commit messages
 * following the conventional commits specification based on a provided git diff.
 */
export class ConventionalCommitsStrategy implements CommitMessageStrategy {
    public getPrompt(diff: string, context?: string): string {
        const commitConvention = "Conventional Commit Convention";
        const missionStatement =
            `Your mission is to create clean and comprehensive commit messages as per the ${commitConvention} and explain WHAT were the changes and mainly WHY the changes were done.`;
        const diffInstruction =
            "I'll send you an output of 'git diff --staged' command, and you are to convert it into a commit message.";
        const conventionGuidelines =
            "Do not preface the commit with anything, except for the conventional commit keywords: fix, feat, build, chore, ci, docs, style, refactor, perf, test.";
        const descriptionGuideline =
            "Don't add any descriptions to the commit, only commit message.";
        const oneLineCommitGuideline =
            "Craft a concise commit message that encapsulates all changes made, with an emphasis on the primary updates. If the modifications share a common theme or scope, mention it succinctly; otherwise, leave the scope out to maintain focus. The goal is to provide a clear and unified overview of the changes in a one single message, without diverging into a list of commit per file change.";
        const generalGuidelines =
            `Use the present tense. Lines must not be longer than 74 characters. Use english language for the commit message.`;
        const userInputContext = this.userInputCodeContext(context ?? "");

        return `${missionStatement}\n${diffInstruction}\n${conventionGuidelines}\n${descriptionGuideline}\n${oneLineCommitGuideline}\n${generalGuidelines}\n${userInputContext}\n${diff}`;
    }

    private userInputCodeContext(context: string) {
        if (context !== "" && context !== " ") {
            return `Additional context provided by the user: <context>${context}</context>\nConsider this context when generating the commit message, incorporating relevant information when appropriate.`;
        }
        return "";
    }
}

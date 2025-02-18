import { CommitMessageStrategy } from "./CommitMessageStrategy.ts";

export class ConventionalCommitsStrategy implements CommitMessageStrategy {
    public getPrompt(diff: string, context?: string): string {
        const userInputContext = this.userInputCodeContext(context ?? "");

        return `
${this.missionStatement}
${this.diffInstruction}
${this.conventionGuidelines}
${this.descriptionGuideline}
${this.oneLineCommitGuideline}
${this.generalGuidelines}
${userInputContext}

${diff}`;
    }

    private userInputCodeContext(context: string) {
        if (context !== "" && context !== " ") {
            return `Additional context provided by the user: <context>${context}</context>\nConsider this context when generating the commit message, incorporating relevant information when appropriate.`;
        }
        return "";
    }

    private readonly missionStatement =
        `Your mission is to create clean and comprehensive commit messages as per the Conventional Commit Convention and explain WHAT were the changes and mainly WHY the changes were done.`;
    private readonly diffInstruction =
        "I'll send you an output of 'git diff --staged' command, and you are to convert it into a commit message.";
    private readonly conventionGuidelines =
        "Do not preface the commit with anything, except for the conventional commit keywords: fix, feat, build, chore, ci, docs, style, refactor, perf, test.";
    private readonly descriptionGuideline =
        "Don't add any descriptions to the commit, only commit message.";
    private readonly oneLineCommitGuideline =
        "Craft a concise commit message that encapsulates all changes made, with an emphasis on the primary updates. If the modifications share a common theme or scope, mention it succinctly; otherwise, leave the scope out to maintain focus. The goal is to provide a clear and unified overview of the changes in a one single message, without diverging into a list of commit per file change.";
    private readonly generalGuidelines =
        `Use the present tense. Lines must not be longer than 74 characters. Use english language for the commit message.`;
}

import { CommitMessageStrategy } from "./CommitMessageStrategy.ts";

export class GitmojiCommitStrategy implements CommitMessageStrategy {
    public getPrompt(diff: string): string {
        return (
            `
I want you to act as the author of a commit message in git.
I'll enter a git diff, and your job is to convert it into a useful commit message in english language.
Do not preface the commit with anything, use the present tense, return the full sentence, and use the gitmoji commit specification (<suitable gitmoji> <subject>)
Then leave an empty line and continue with a more detailed explanation.
Write only one sentence for the first part, and two or three sentences at most for the detailed explanation.

${diff}`
        );
    }
}

import { Command, EnumType } from "@cliffy/command";
import { getGitDiff } from "./GitClient.ts";
import { colors } from "@cliffy/ansi/colors";
import { CommitMessageStrategyFactory } from "./CommitMessageStrategyFactory.ts";
import { getCommitMessage } from "./HttpClient.ts";
import clipboard from 'clipboardy';

export enum CommitMessageStrategyArgs {
    CONVENTIONAL_COMMITS = "conventional-commits",
    GITMOJI = "gitmoji",
}

const commitMessageStrategy = new EnumType(CommitMessageStrategyArgs);

await new Command()
    .name("aicommit")
    .version("1.0.0")
    .description("Generate your commit messages with AI")
    .type("message-strategy", commitMessageStrategy)
    .option(
        "-s, --strategy <strategy:message-strategy>",
        "Specify the commit message strategy",
        {
            default: CommitMessageStrategyArgs.CONVENTIONAL_COMMITS,
            required: true,
        },
    )
    .option(
        "-p, --extra-prompt <extra-prompt:string>",
        "Specify and additional extra prompt for context",
        { required: false },
    )
    .arguments("<git-directory:file>")
    .action(async ({ strategy: strategyArg, extraPrompt }, directory) => {
        const { diff, operationTimeMs } = await getGitDiff(directory);

        if (diff.trim().length === 0) {
            console.error(
                colors.red(
                    "No staged changes were found. Did you forget to stage your changes before running aicommit?",
                ),
            );
            return Deno.exit();
        }

        console.info(colors.green(`Received diff in ${operationTimeMs}ms`));

        const strategy = CommitMessageStrategyFactory.getStrategy(strategyArg);
        const prompt = strategy.getPrompt(diff);
        console.info(colors.green("Reaching out to AI..."));
        let { commitMessage, durationMs } = await getCommitMessage(prompt);
        console.info(
            colors.green(`Received AI commit message in ${durationMs}ms. Copying to clipboard...`),
        );
        clipboard.writeSync(commitMessage)
    })
    .parse(Deno.args);

import { Command, EnumType } from "@cliffy/command";
import { getGitDiff } from "./git/GitClient.ts";
import { colors } from "@cliffy/ansi/colors";
import { CommitMessageStrategyFactory } from "./commit/CommitMessageStrategyFactory.ts";
import { getCommitMessage } from "./infra/HttpClient.ts";
import { Logger } from "./infra/Logger.ts";
import { writeText } from "https://deno.land/x/copy_paste/mod.ts";

export enum CommitMessageStrategyArgs {
    CONVENTIONAL_COMMITS = "conventional-commits",
    GITMOJI = "gitmoji",
}

const commitMessageStrategy = new EnumType(CommitMessageStrategyArgs);

await new Command()
    .name("aicommit")
    .version("1.0.0-beta")
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
        Logger.info(
            "Querying git diff for directory",
            colors.italic(directory),
            `using ${strategyArg} strategy...`,
        );

        const { diff, operationTimeMs } = await getGitDiff(directory);

        if (diff.trim().length === 0) {
            Logger.error(
                "No staged changes were found. Did you forget to stage your changes before running aicommit?",
            );

            return Deno.exit();
        }

        Logger.info(
            `Successfully received git diff in ${operationTimeMs}ms. Fetching AI response...`,
        );

        const strategy = CommitMessageStrategyFactory.getStrategy(strategyArg);
        const prompt = strategy.getPrompt(diff, extraPrompt);

        const { commitMessage, durationMs } = await getCommitMessage(prompt);

        Logger.info(
            `Received AI commit message in ${durationMs}ms.`,
        );
        console.log(commitMessage);

        await writeText(commitMessage);

        Logger.info("Copied commit message to clipboard");
    })
    .parse(Deno.args);

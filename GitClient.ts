import { CleanOptions, simpleGit } from "simple-git";

export async function getGitDiff(
    directory: string,
): Promise<{ diff: string; operationTimeMs: number }> {
    const git = simpleGit(directory).clean(CleanOptions.FORCE);

    const start = Date.now();

    const diff = await git.diff([
        "--staged",
        "--",
        ":!*.lock", // Exclude files ending in .lock
        ":!package-lock.json", // Explicitly exclude package-lock.json
    ]);

    const operationTimeMs = Date.now() - start;

    return { diff, operationTimeMs };
}

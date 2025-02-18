import { CleanOptions, simpleGit } from "simple-git";

export async function getGitDiff(
    directory: string,
): Promise<{ diff: string; operationTimeMs: number }> {
    const git = simpleGit(directory).clean(CleanOptions.FORCE);

    const start = Date.now();

    const diff = await git.diff(["--staged"]);

    const operationTimeMs = Date.now() - start;

    return { diff, operationTimeMs };
}

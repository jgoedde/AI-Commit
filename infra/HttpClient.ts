export async function getCommitMessage(
    prompt: string,
): Promise<{ commitMessage: string; durationMs: number }> {
    const requestStart = Date.now();

    const response = await fetch("https://run.chayns.codes/bfb8d38b", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.slice(0, 15000) }),
    });

    const commitMessage = ((await response.json()) as { aiRes: string }).aiRes;

    const duration = Date.now() - requestStart;

    return { commitMessage, durationMs: duration };
}

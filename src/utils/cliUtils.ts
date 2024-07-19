import readline from 'node:readline';

export async function askQuestion(q: string): Promise<unknown> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) =>
        rl.question(q, (ans) => {
            rl.close();
            resolve(ans);
        }),
    );
}

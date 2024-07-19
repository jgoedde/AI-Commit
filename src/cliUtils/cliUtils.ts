import readline from 'node:readline';
import { z } from 'zod';

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

export const cliArgsSchema = z.object({
    t: z
        .literal('gitmoji')
        .or(z.literal('gm'))
        .or(z.literal('conventional'))
        .or(z.literal('conv'))
        .or(z.literal('cc'))
        .default('gitmoji'),
});

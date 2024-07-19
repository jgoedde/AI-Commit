import chalk from 'chalk';
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

export function showHelp(): void {
    console.log('Usage:', 'node main.js <repositoryPath> [options]');
    console.log('');
    console.log('Options:');
    console.log(
        '  ',
        chalk.whiteBright('-t <type>'),
        '  Type of commit message to generate (gitmoji, gm, conventional, conv, cc). Defaults to',
        chalk.yellowBright('gitmoji'),
    );
    console.log('');
    console.log('Examples:');
    console.log(
        '  node main.js . -t gitmoji',
        chalk.gray('- Runs the tool in the current directory using gitmoji strategy.'),
    );
    console.log(
        '  node main.js . -t cc',
        chalk.gray('- Runs the tool in the current directory using conventional commits strategy.'),
    );
    console.log('  node main.js', chalk.gray('- Runs the tool in the current directory using gitmoji strategy.'));
    console.log('');
}

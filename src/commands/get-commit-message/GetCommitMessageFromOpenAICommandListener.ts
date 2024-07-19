import chalk from 'chalk';
import { eventBroker } from '../../utils/eventBroker.js';

eventBroker.on('received-open-ai-response-event', (duration, statusText) => {
    console.log(
        '✅ ',
        chalk.white(`Received response`),
        chalk.whiteBright(statusText),
        chalk.white('from chayns.codes in'),
        chalk.whiteBright(`${duration}ms.`),
    );
});

eventBroker.on('unable-to-generate-commit-message', (err) => {
    console.log(
        '❌ ',
        chalk.redBright('An error occurred while getting the AI response.'),
        chalk.redBright('Is the diff too long?'),
        chalk.whiteBright('Stack trace:'),
        chalk.redBright(err.stack),
    );
});

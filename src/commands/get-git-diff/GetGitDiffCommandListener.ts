import chalk from 'chalk';
import { eventBroker } from '../../utils/eventBroker.js';

eventBroker.on('git-diff-received-event', (result) => {
    console.log(
        '🖹',
        chalk.white('Successfully fetched git diff in'),
        chalk.whiteBright(`${result.duration}ms`),
        chalk.white('with a length of'),
        chalk.whiteBright(`${result.diff.length} characters.`),
    );
});

eventBroker.on('git-diff-unavailable-event', (result) => {
    console.log('❌ ', chalk.redBright('Error getting git diff'), chalk.whiteBright(result));
});

eventBroker.on('git-diff-empty-event', () => {
    console.log('🤷', chalk.redBright('git diff returned no results. Did you forget to stage your changes?'));
});

eventBroker.on('git-diff-started-event', (options) => {
    console.log(
        '🖹',
        chalk.white('Fetching'),
        chalk.whiteBright('git diff'),
        chalk.white('with options'),
        chalk.whiteBright(JSON.stringify(options)),
        chalk.white('...'),
    );
});

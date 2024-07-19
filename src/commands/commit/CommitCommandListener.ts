import chalk from 'chalk';
import { eventBroker } from '../../utils/eventBroker.js';

eventBroker.on('commit-message-cleaned-event', (commitMessage) => {
    console.log('✅ ', chalk.greenBright('Successfully generated commit message.\n'));
    console.log(chalk.white(commitMessage), '\n');
});

eventBroker.on('committed-event', () => {
    console.log('✅ ', chalk.greenBright('Committed.'));
});

eventBroker.on('commit-message-copied-to-clipboard-event', () => {
    console.log('🚫', chalk.whiteBright('Committing skipped, but copied to clipboard.'));
});

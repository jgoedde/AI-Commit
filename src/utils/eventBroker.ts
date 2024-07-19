import {
    CommitMessageError,
    CommitMessageResult,
} from '../commands/get-commit-message/GetCommitMessageFromOpenAICommand.js';
import { GitDiffError, GitDiffResult } from '../commands/get-git-diff/GetGitDiffCommand.js';
import { TypedEventEmitter } from './TypedEventEmitter.js';

type LocalEventTypes = {
    'git-diff-received-event': [result: GitDiffResult];
    'git-diff-unavailable-event': [error: GitDiffError];
    'received-open-ai-response-event': [duration: number, statusText: string];
    'received-commit-message-event': [result: CommitMessageResult];
    'unable-to-generate-commit-message': [result: CommitMessageError];
    'commit-message-cleaned-event': [result: string];
    'committed-event': [];
    'commit-message-copied-to-clipboard-event': [];
    'git-diff-started-event': [diffOptions: string[]];
};

export const eventBroker = new TypedEventEmitter<LocalEventTypes>();

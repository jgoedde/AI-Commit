import { Result } from 'ts-results-es';

export interface Command<TSuccess, TError = Error> {
    execute(): Promise<Result<TSuccess, TError>>;
}

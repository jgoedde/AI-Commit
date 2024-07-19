import axios, { AxiosError } from 'axios';
import { Err, Ok, Result } from 'ts-results-es';
import { z, ZodError } from 'zod';
import { Command } from '../../types/Command.js';
import { eventBroker } from '../../utils/eventBroker.js';

export type CommitMessageResult = {
    message: string;
};

export type CommitMessageError = AxiosError | ZodError | Error;

export class GetCommitMessageFromOpenAICommand implements Command<CommitMessageResult, CommitMessageError> {
    private readonly responseSchema = z.object({
        aiRes: z.string().min(30),
    });

    public constructor(private readonly prompt: string) {
        this.prompt = prompt;
    }

    public async execute(): Promise<Result<CommitMessageResult, CommitMessageError>> {
        try {
            const requestStart = Date.now();

            const response = await axios.post<{ aiRes: string }>(
                'https://run.chayns.codes/8e489003',
                {
                    prompt: this.prompt.slice(0, 10000),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            const duration = Date.now() - requestStart;

            eventBroker.emit('received-open-ai-response-event', duration, response.statusText);

            const safeParse = this.responseSchema.parse(response.data);

            eventBroker.emit('received-commit-message-event', { message: safeParse.aiRes });

            return Ok({ message: safeParse.aiRes });
        } catch (error) {
            eventBroker.emit('unable-to-generate-commit-message', error);

            if (error instanceof ZodError) {
                return Err(error);
            }

            if (error instanceof AxiosError) {
                return Err(error);
            }

            return Err(error);
        }
    }
}

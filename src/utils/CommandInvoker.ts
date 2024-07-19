import { Command } from '../types/Command.js';

export class CommandInvoker {
    private commands: Command<unknown, unknown>[] = [];

    public addCommand(command: Command<unknown, unknown>): void {
        this.commands.push(command);
    }

    public async executeCommands(): Promise<void> {
        for (const command of this.commands) {
            await command.execute();
        }
    }
}

import { Colors, colors } from "@cliffy/ansi/colors";

export class Logger {
    private static readonly myColors: Colors = colors();

    static info(message: string, ...args: string[]) {
        console.log(
            `${
                Logger.myColors.bold(Logger.myColors.blue("[INFO]"))
            } ${message} ${args.join(" ")}`,
        );
    }

    static warn(message: string, ...args: string[]) {
        console.log(
            `${Logger.myColors.bold(Logger.myColors.yellow("[WARN]"))} ${
                Logger.myColors.yellow(message)
            } ${args.join(" ")}`,
        );
    }

    static error(message: string, ...args: string[]) {
        console.log(
            `${Logger.myColors.bold(Logger.myColors.red("[ERROR]"))} ${
                Logger.myColors.red(message)
            } ${args.join(" ")}`,
        );
    }
}

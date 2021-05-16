import chalk from 'chalk';
import ora from 'ora';
import { logger, cleaner } from './index';


// 尽量不要用async函数来做最终的异常处理
async function handleSignal(signal: string): Promise<void> {
	const spiner = ora('do clean up...\n').start();
	try {
		await cleaner.cleanup(signal);
		spiner.succeed('Exiting without error.');
	} catch (e) {
		logger.error(`Clean up failed. Error message: ${e.message}`);
		console.error(chalk.red(e.stack));
		process.exit(1);
	}
	process.exit();
}

interface CustomError {
	msg: string;
	stack: string;
}

function isCustomError(e: any): e is CustomError {
	return !!e.msg;
}

// 尽量不要用async函数来做最终的异常处理
async function handleError(e: Error | CustomError): Promise<any> {
	if (isCustomError(e)) {
		logger.error(e.msg);
	} else {
		logger.error(e.message);
	}

	console.error(chalk.red(e.stack as string));
	
	const spiner = ora('do clean up...\n').start();
	try {
		await cleaner.cleanup();
		spiner.succeed('clean up done.');
	} catch (err) {
		logger.error(`Clean up failed. Error message: ${err.message}`);
		console.error(chalk.red(err.stack));
	}
	process.exit(1);
}

export { handleError, handleSignal };
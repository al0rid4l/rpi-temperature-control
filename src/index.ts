import './lib/utils/safe-promise';

import yargs, { Argv } from 'yargs';
import yargonaut from 'yargonaut';
import chalk from 'chalk';
import { handleError, handleSignal } from './lib/utils/error-handler';
import { getCmds,  getFiglet, sleep, pkg, logger, cleaner } from './lib/utils';
import si from 'systeminformation';
import { BinaryValue, Gpio } from 'onoff';

interface CmdArgv {
	u: number;
	l: number;
	i: number;
	g: Array<number>
}

interface CmdAlias {
	upperBound: number;
	lowerBound: number;
	interval: number;
	gpioPin: Array<number>
}


const { version, author } = pkg;

const authorName = typeof author === 'string' ? author : (author as any).name as string;

process.once('SIGHUP', handleSignal);
process.once('SIGQUIT', handleSignal);
process.once('SIGINT', handleSignal);
process.once('SIGTERM', handleSignal);
process.addListener('uncaughtException', handleError);

(async (): Promise<void> => {
	const cmdName = getCmds()[0],
		logo = await getFiglet(cmdName);
	(yargs as any).logo = logo;

	yargonaut
		.helpStyle('blue.underline')
		.style('red.bold', 'required')
		.style('magenta', ['boolean', 'string']);

	yargs
		.scriptName(cmdName)
		.completion('completion', 'get completion script')
		.options({
			u: {
				alias: 'upper-bound',
				desc: 'temperature upper bound',
				default: 53,
				number: true
			},
			l: {
				alias: 'lower-bound',
				desc: 'temperature lower bound',
				default: 48,
				number: true
			},
			i: {
				alias: 'interval',
				desc: 'interval, ms',
				default: 5000,
				number: true
			},
			g: {
				alias: 'gpio-pin',
				desc: 'gpio pin number',
				require: true,
				array: true,
				coerce(val: Array<string>): Array<number> {
					return val && val.map(v => parseInt(v, 10));
				}
			}
		})
		.alias('h', 'help')
		.alias('v', 'version')
		.example(`${cmdName} -g 23 24 -u 53 -l 48`, 'set gpio pin 23 24 high voltage, temperature upper bound 53C, lower bound 48C.')
		.usage(`${chalk.yellowBright(logo)}\n\n${chalk.blue.underline('Usage:')}\n  ` +
				`${cmdName} -g <gpio-pin> [options]`
		)
		.version(version)
		.epilog(`By ${authorName}`)
		.help()
		// ???????????????async??????, ???????????????????????????
		// MMP????????????types???????????????????????????
		.fail((async (msg: string, err: Error, yargs: Argv): Promise<void> => {
			// ????????????????????????????????????????????????, ????????????fail???????????????????????????fail??????
			if (err) {
				await handleError(err);
			} else {
				logger.error(msg);
				// ???????????????????????????
				yargs.showHelp();
				process.exit(1);
			}
		}) as any);

	const argv = yargs.argv;

	// ?????????????????????????????????help
	// if (!argv._.length) {
	// 	yargs.showHelp();
	// }





	const { HIGH, LOW } = Gpio, SPEED = 1;
	const {
		upperBound,
		lowerBound,
		interval,
		gpioPin
	} = argv as unknown as CmdArgv & CmdAlias;
	const powers = gpioPin.map(n => new Gpio(n, 'out'));
	let signal: BinaryValue = LOW, lastTemperature = 100, k = 0.3;

	cleaner.setState(powers);

	// eslint-disable-next-line
	while(true) {
		const { main: currentTemperature } = await si.cpuTemperature();
		k = (currentTemperature - lastTemperature) / (interval / 1000);
		lastTemperature = currentTemperature;

		// ??????????????????????????????????????????
		if(currentTemperature >= upperBound || k >= SPEED) {
			signal = HIGH;
			await Promise.all(powers.map(p => p.write(signal)));
		} else if (currentTemperature <= lowerBound) {
			signal = LOW;
			await Promise.all(powers.map(p => p.write(signal)));
		}
		
		logger.info(`temperature: ${currentTemperature}, fan status: ${signal === HIGH ? 'on' : 'off'}`);
		await sleep(interval);
	}

})();

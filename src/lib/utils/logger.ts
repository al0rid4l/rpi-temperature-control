import figures from 'figures';
import chalk from 'chalk';

export const error = (msg: string): void => console.error(chalk.red(`${figures.cross} ${msg}`));

// eslint-disable-next-line
export const success = (msg: string): void => console.log(`${chalk.green(figures.tick)} ${msg}`);

export const warn = (msg: string): void => console.warn(`${chalk.red(figures.warning)} ${chalk.yellow(msg)}`);

// eslint-disable-next-line
export const info = (msg: string): void => console.log(`${chalk.cyan(figures.radioOn)} ${msg}`);


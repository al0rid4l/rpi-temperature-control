import figlet from 'figlet';
import { resolve } from 'path';
import os from 'os';
import cleaner from './cleaner';
import * as logger from './logger';
// 这东西用require直接引入, 防止被tsc直接copy到dist导致一些问题, 并且以
// 打包后的相对路径来引入
// eslint-disable-next-line
const _pkg = require('../../../../package.json');


const TODO_DIR = resolve(os.homedir(), '.todo');

type PromiseData = [undefined, any];

type PromiseError = [any, undefined];

export const pkg = _pkg;

export type Callable = (...args: any[]) => any;

export type AsyncCallable = (...args: any[]) => Promise<any>;

export const isAsyncFunction = (fn: any): fn is AsyncCallable => fn[Symbol.toStringTag] === 'AsyncFunction';

export const to = (p: Promise<any>): Promise<PromiseData | PromiseError> => p.then((data: any): PromiseData => [undefined, data]).catch((err: any): PromiseError => [err, undefined]);

export const sleep = (time: number): Promise<any> => new Promise<any>((rs: any): any => setTimeout(rs, time));

export const getAbsolutePath = (rel: string): string => resolve(process.cwd(), rel);

export const getCmds = (): string[] => Object.keys(pkg.bin);

export const getFiglet = (cmd: string): Promise<string> => new Promise<string>((rs: any, rj: any): void => {
	figlet(cmd, {
		horizontalLayout: 'fitted'
	}, (err: Error | null, data?: string): void => {
		if (err) {
			rj(err);
		} else {
			rs(data);
		}
	});

});

export { logger, TODO_DIR, cleaner };

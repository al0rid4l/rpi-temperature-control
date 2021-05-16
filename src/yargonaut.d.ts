declare module 'yargonaut' {
	interface Yargonaut {
		helpStyle(arg: string): this
		style(arg0: string, arg1: string | Array<string>): this
	}

	const dft: Yargonaut;
	export default dft;
}
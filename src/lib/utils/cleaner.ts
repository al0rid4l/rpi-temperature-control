import { Gpio } from 'onoff';

export default {
	powers: [] as Array<Gpio>,
	setState(powers: Array<Gpio>): void {
		this.powers = powers;
	},
	// eslint-disable-next-line
	async cleanup(signal?: string): Promise<void> {
		await this.powers.map(p => p.write(Gpio.LOW));
	}
};
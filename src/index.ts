import { Construct } from 'constructs';
import deepmerge from 'ts-deepmerge';

export default class Config {
	private static instance: Config;

	private construct: Construct | undefined = undefined;

	/**
	 *
	 * @param context
	 * @returns Singleton instance
	 */
	public static getInstance(scope: Construct) {
		if (!Config.instance) {
			Config.instance = new Config();

			Config.instance.construct = scope;
		}

		return Config.instance;
	}

	/**
	 * Build config object from desired environment
	 * @param env
	 * @returns AWS CDK configuration object of T
	 */
	public build<T>(env?: string): T {
		if (!this.construct) {
			throw new Error(`[build] instance has no construct object`);
		}

		let configurationStr = env
			? this.construct.node.tryGetContext(env)
			: undefined;

		if (!configurationStr) {
			configurationStr = this.construct.node.tryGetContext('_');
		}

		const obj = this.tryParseJson<T>(configurationStr);

		return this.combineEnvConfigWithBase(obj) as T;
	}

	/**
	 * Try parse JSON string to object
	 * @param str
	 * @returns JSON object of type T or {}
	 */
	private tryParseJson<T>(str: string): T {
		try {
			if (typeof str === 'object') {
				return str;
			}

			return JSON.parse(str);
		} catch (ex) {
			console.log('try parse issue', (ex as Error).message);
			return {} as T;
		}
	}

	/**
	 *
	 */
	private combineEnvConfigWithBase<T>(envConfig: T) {
		const baseConfigStr = this.construct?.node.tryGetContext('_');

		if (!baseConfigStr) {
			return envConfig;
		}

		const baseConfigObj = this.tryParseJson<T>(baseConfigStr);

		return deepmerge<any>(baseConfigObj, envConfig);
	}
}

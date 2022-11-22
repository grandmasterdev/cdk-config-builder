import { Construct } from 'constructs';

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
	public build<T>(env: string): T | {} {
		if (!env) {
			throw new Error(`[build] Missing "env" in argument`);
		}

		if (!this.construct) {
			throw new Error(`[build] instance has no construct object`);
		}

        const configurationStr = this.construct.node.tryGetContext(env);

		const obj = this.tryParseJson<T>(configurationStr);

		return this.combineEnvConfigWithBase(obj) as T ?? {};
	}

	/**
	 * Try parse JSON string to object
	 * @param str
	 * @returns JSON object of type T or {}
	 */
	private tryParseJson<T>(str: string): T | {} {
		try {
			if(typeof str === "object") {
				return str;
			}

			return JSON.parse(str);
		} catch (ex) {
			console.log('try parse issue', (ex as Error).message);
			return {};
		}
	}

	/**
	 * 
	 */
	private combineEnvConfigWithBase<T>(envConfig: T) {
		const baseConfig = this.construct?.node.tryGetContext('default');

		if(!baseConfig) {
			return envConfig;
		}

		return {
			...this.tryParseJson<T>(baseConfig),
			...envConfig
		}
	}
}

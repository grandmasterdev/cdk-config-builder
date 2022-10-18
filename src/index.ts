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

		return (obj[env as keyof typeof obj] as T) ?? {};
	}

	/**
	 * Try parse JSON string to object
	 * @param str
	 * @returns JSON object of type T or {}
	 */
	private tryParseJson<T>(str: string): T | {} {
		try {
			return JSON.parse(str);
		} catch (ex) {
			return {};
		}
	}
}

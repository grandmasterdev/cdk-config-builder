import Config from './index';
import cut from './index';

jest.mock('constructs');

const mockedConstruct = {
	node: {
		tryGetContext: jest.fn((env: string) => {
			if (env === 'dev') {
				return JSON.stringify({
					AccountAlias: 'aws-account-alias',
					Application: 'random-app',
					SomeProps: {
						Ping: 'Pong',
					},
				});
			}
			if (env === '_') {
				return JSON.stringify({
					SharedProps: 'all should have me',
					SomeProps: {
						Foo: 'bar',
					},
				});
			}
		}),
	},
};

type MockCdkConfig = {
	AccountAlias: string;
	Application: string;
};

describe('AWS CDK builder tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return instance of AwsCdkConfigBuilder', () => {
		expect(cut.getInstance(mockedConstruct as any)).toBeInstanceOf(Config);
	});

	it('should return configuration object of MockCdkConfig', () => {
		const result = cut
			.getInstance(mockedConstruct as any)
			.build<MockCdkConfig>('dev');

		expect(result).toStrictEqual({
			AccountAlias: 'aws-account-alias',
			SharedProps: 'all should have me',
			Application: 'random-app',
			SomeProps: {
				Ping: 'Pong',
				Foo: 'bar'
			},
		});
	});

	it('should return default object if no env is present', () => {
		const result = cut
			.getInstance(mockedConstruct as any)
			.build<MockCdkConfig>();

		expect(result).toStrictEqual({
			SharedProps: 'all should have me',
			SomeProps: {
				Foo: 'bar',
			},
		});
	});
});

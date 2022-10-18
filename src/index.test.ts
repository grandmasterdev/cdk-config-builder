import Config from './index';
import cut from './index';
import { mocked } from 'jest-mock';
import { Construct } from 'constructs';

jest.mock('constructs');

const mockedConstruct = {
  node: {
    tryGetContext: jest.fn(() => {
      return JSON.stringify({
        dev: {
          AccountAlias: 'aws-account-alias',
          Application: 'random-app',
        },
      });
    })
  }
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
			Application: 'random-app',
		});
	});

	it('should return empty object when "env" passed not in the context', () => {
		const result = cut
			.getInstance(mockedConstruct as any)
			.build<MockCdkConfig>('none');

		expect(result).toStrictEqual({});
	});
});

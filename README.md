# CDK CONFIG BUILDER

A tool to help build and extract configuration for different environments/accounts which come from AWS CDK `context`.

## Getting Started

Ensure that you have all your AWS configuration stored in a CDK context file:

```
cdk.context.json
```

Your `context` file content should be in format like the following...

```json
{
	"dev": {
		"AccountAlias": "aws-account-alias",
		"ApplicationName": "demo app"
	},
	"prod": {
		"AccountAlias": "aws-account-alias-prod",
		"ApplicationName": "demo app prod"
	}
}
```

## Installing

```bash
> npm install --save aws-cdk-config-builder

```

## How to use?

### 1. Basic use

```typescript
import configration from 'aws-cdk-config-builder';

// this is the cdk construct scope
const config = configuration.Config(this).build('dev');
```

### 2. Adding typing to the response

```typescript
// this is the cdk construct scope
const config = configuration.Config(this).build<ConfigType>('dev');

type ConfigType = {
	AccountAlias: string;
	ApplicationName: string;
};
```

### 3. Configuration inheritance

If you have a common properties with the same values across different environments, you may use
`_` object as follows:

```json
{
	"_": {
		"lambda": {
			"memorySize": 128
		}
	},
	"dev": {
		"bucket": {
			"name": "somebucket-1"
		}
	}
}
```

The above will return the following value as configuration when `environment` is set as `dev`.

```json
{
	"bucket": {
		"name": "somebucket-1"
	},
	"lambda": {
		"memorySize": 128
	}
}
```

#### 3.1 Overriding 

The `environment` properties may override the `_` simply by doing the following...

```json
{
	"_": {
		"lambda": {
			"memorySize": 128
		}
	},
	"dev": {
		"bucket": {
			"name": "somebucket-1"
		},
        "lambda": {
			"memorySize": 512
		}
	}
}
```

And the above will result in the following configuration when `dev` is selected as `environment`...

```json
{
	"bucket": {
		"name": "somebucket-1"
	},
	"lambda": {
		"memorySize": 512
	}
}
```



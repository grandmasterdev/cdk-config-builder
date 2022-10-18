# AWS CDK CONFIG BUILDER

A tool to help build and extract configuration for different environments/accounts which come from AWS CDK `context`.

## Getting Started

Ensure that you have all your AWS configuration stored in a CDK context file:

```
cdk.context.json
```

Your `context` file content should be in format like the following...

```json

{
    dev: {
        AccountAlias: 'aws-account-alias',
        ApplicationName: 'demo app'
    },
    prod: {
        AccountAlias: 'aws-account-alias-prod',
        ApplicationName: 'demo app prod'
    }
}

```

## Installing

```bash
> npm install --save aws-cdk-config-builder

```

## How to use?

1. Basic use

```typescript

import configration from 'aws-cdk-config-builder';

const configContext = this.node.tryGetContext('config');

const config = configuration.Config(configContext).build('dev');

```

2. Adding typing to the response

```typescript

const config = configuration.Config(configContext).build<ConfigType>('dev');

type ConfigType = {
    AccountAlias: string;
    ApplicationName: string;
}

```
# pino-sqs

![CI](https://github.com/siddmoitra/pino-sqs/workflows/CI/badge.svg?branch=master&event=push)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/83d93f06219843b8887556bdcfbccb02)](https://app.codacy.com/manual/siddmoitra/pino-sqs?utm_source=github.com&utm_medium=referral&utm_content=siddmoitra/pino-sqs&utm_campaign=Badge_Grade_Dashboard)
[![Known Vulnerabilities](https://snyk.io/test/github/siddmoitra/pino-sqs/badge.svg?targetFile=package.json)](https://snyk.io/test/github/siddmoitra/pino-sqs?targetFile=package.json)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This module provides a "transport" for [pino](http://getpino.io/#/) that forwards messages to AWS SQS queue. For other transports, see [here](http://getpino.io/#/docs/transports?id=known-transports)


## Installation

To use globally from command line:

```bash
$ npm install -g @sidmoitra/pino-sqs
```

To include as a library in your project:

```bash
$ npm install @sidmoitra/pino-sqs
```

## CLI

Want to use `@sidmoitra/pino-sqs` from the CLI?

Given an application `my-app` that logs via pino, you would use `@sidmoitra/pino-sqs` like so:

### 1. If installed globally
```bash
$ node my-app | pino-sqs <options>
```

### 2. If installed as a library
```bash
$ node my-app | npx pino-sqs <options>
```


## Usage

You can pass the following options via cli arguments or use the environment variable associated:

| Full command      | Environment variable  | Description                                         |
| ---               | ---                   | ---                                                 |
| --queue-url       | PS_QUEUE_URL          | The AWS SQS URL                                     |
| --aws-access-key  | PS_AWS_ACCESS_KEY     | AWS Access Key, required only if ECS is not enabled |
| --aws-secret-key  | PS_AWS_SECRET_KEY     | AWS Secret Key, required only if ECS is not enabled |
| --ecs-enabled     | -                     | If ECS is enabled. Defaults to **FALSE**            |

### Examples

#### Case 1: Your app does not run on AWS ECS

```bash
$ node my-app | pino-sqs --queue-url <queueUrl> --aws-access-key <access_key> --aws-secret-key <secret_key>
```

#### Case 2: Your app runs on AWS ECS

```bash
$ node my-app | pino-sqs --queue-url <queueUrl> --ecs-enabled
```


## Maintainers

Sid Moitra

## Contributing

It's simple:

1. Fork it!
2. Clone your repository
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request


## License

Licensed under [MIT](./LICENSE).

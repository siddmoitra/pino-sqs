# pino-sqs

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/83d93f06219843b8887556bdcfbccb02)](https://app.codacy.com/manual/siddmoitra/pino-sqs?utm_source=github.com&utm_medium=referral&utm_content=siddmoitra/pino-sqs&utm_campaign=Badge_Grade_Dashboard)

This module provides a "transport" for [pino](http://getpino.io/#/) that forwards messages to AWS SQS queue.

## Installation

To use globally from command line:

```bash
$ npm install -g @siddmoitra/pino-sqs
```

To include as a library in your project:

```bash
$ npm install @siddmoitra/pino-sqs
```

## CLI

Want to use `@siddmoitra/pino-sqs` from the CLI?

To use `@siddmoitra/pino-sqs` from the command line, you need to install it globally:

```bash
$ npm install -g @siddmoitra/pino-sqs
```

## Example

Given an application `my-app` that logs via pino, you would use `@siddmoitra/pino-sqs` like so:

```bash
$ node my-app | pino-sqs <options>
```

## Usage

You can pass the following options via cli arguments or use the environment variable associated:

| Short command | Full command | Environment variable | Description |
| --- | --- | --- | --- |


## API

Want to use `@siddmoitra/pino-sqs` as a library in your project?

To be followed...

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

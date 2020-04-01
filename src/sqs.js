/* eslint-disable no-underscore-dangle */
const AWS = require('aws-sdk');
const stream = require('stream');
const { AccessCredentials } = require('./access');

class SQSClient {
  constructor(options = {}) {
    this._sqsQueueUrl = options.sqsQueueUrl;
    this._awsRegion = options.awsRegion;
    this._stdoutEnabled = options.stdoutEnabled;
    this._accessCredentials = new AccessCredentials(options);
  }

  async sendMessage(items = []) {
    const data = Array.isArray(items) ? items : [items];
    if (data.length <= 0) {
      return data;
    }
    const accessCreds = await this._accessCredentials.getAccess();
    const sqs = new AWS.SQS({
      apiVersion: '2012-11-05',
      region: this._awsRegion,
      accessKeyId: accessCreds.AccessKeyId,
      secretAccessKey: accessCreds.SecretAccessKey,
      sessionToken: accessCreds.Token,
    });
    try {
      const params = {
        MessageBody: JSON.stringify(data),
        QueueUrl: this._sqsQueueUrl,
      };
      const response = await sqs.sendMessage(params).promise();
      const messageId = response.MessageId;
      data.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.sqsMessageId = messageId;
      });
      return data;
    } catch (err) {
      console.warn(JSON.stringify({
        logLevel: 'warn',
        message: `The previous log(s) have not been sent. Reason: ${err.message}\n${err.stack}`,
      }));
      return data;
    }
  }

  writeStream() {
    const self = this;
    const writeStreamObj = new stream.Writable({
      objectMode: true,
      highWaterMark: 1,
    });
    writeStreamObj._write = (chunk, encoding, callback) => {
      self
        .sendMessage(chunk)
        .then((data) => {
          if (self._stdoutEnabled) {
            data.forEach((item) => console.log(JSON.stringify(item)));
          }
          callback(null);
        });
    };
    return writeStreamObj;
  }
}


module.exports = { SQSClient };

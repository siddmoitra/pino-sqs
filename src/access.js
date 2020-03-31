/* eslint-disable no-underscore-dangle */
const axios = require('axios');

const ACCESS_TOKEN = {
  AccessKeyId: undefined,
  SecretAccessKey: undefined,
  Token: undefined,
  Expiration: undefined,
};

const fetchAccess = async () => {
  const response = await axios.get(`http://169.254.170.2/${process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI}`);
  return response.data;
};

const ensureAccess = async () => {
  const expiration = ACCESS_TOKEN.Expiration ? Date.parse(ACCESS_TOKEN.Expiration) : Date.now();
  const now = Date.now();

  // Always have 1 sec buffer
  if (now - expiration < 1000) {
    const access = await fetchAccess();
    ACCESS_TOKEN.AccessKeyId = access.AccessKeyId;
    ACCESS_TOKEN.SecretAccessKey = access.SecretAccessKey;
    ACCESS_TOKEN.Token = access.Token;
    ACCESS_TOKEN.Expiration = access.Expiration;
  }
};

class AccessCredentials {
  constructor(options = {}) {
    this._ecsEnabled = options.ecsEnabled;
    if (!options.ecsEnabled) {
      ACCESS_TOKEN.AccessKeyId = options.awsAccesskey;
      ACCESS_TOKEN.SecretAccessKey = options.awsSecretKey;
    }
  }

  async getAccess() {
    if (this._ecsEnabled) {
      await ensureAccess();
    }
    return ACCESS_TOKEN;
  }
}

module.exports = { AccessCredentials };

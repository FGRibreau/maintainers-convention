const debug = require('debug')('getFile');
const when = require('when');
const github = require('./github');
const {
  // Mixed -> Undefined|String
  decode
} = require('base64util');

const getGithubFile = (token, repository_content_url) => {
  return when.promise((resolve, reject) => github('get', repository_content_url, {
    access_token: token,
  }, (err, resp, result) => {
    if (err) {
      debug('Error', err);
      return reject(err);
    }

    if(resp.statusCode !== 200){
      debug('Error', resp.statusCode);
      return resolve(null);
    }

    const maintainers = (decode(result.content) || '').split('\n');
    return resolve(maintainers);
  }));
};

module.exports = getGithubFile;

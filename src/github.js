const request = require('requestretry');
const debug = require('debug')('github');
module.exports = (method, url, qs, f) => {
  debug('%s %s %s', method, url, qs);
  request({
    method: method,
    url: url,
    json: true,
    qs: qs,
    timeout:2000,
    headers: {
      'accept': 'application/vnd.github.v3+json',
      'user-agent': 'maintainers convention checker'
    }
  }, f);
}

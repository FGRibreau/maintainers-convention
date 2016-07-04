const debug = require('debug')('getRepos');
const async = require('./async');
const github = require('./github');
const _ = require('lodash');
const when = require('when');

// String -> String -> Promise[Err, Array[Repository]]
function getRepos(organisation, token) {
  return when.promise((resolve, reject) => {
    async.foldUntil({
      repositories: [],
      url: `https://api.github.com/orgs/${organisation}/repos`
    }, function iterator(memo, next, stop) {
      github('get', memo.url, {
        access_token: token,
        type: 'all',
        per_page: 100
      }, function(err, resp, repositories) {
        if (err) {
          debug('Error', err);
          return next(err);
        }

        if (resp.statusCode !== 200) {
          debug('Error', resp.statusCode);
          return next(repositories);
        }

        if(Array.isArray(repositories)){
          memo.repositories = memo.repositories.concat(repositories);
        }

        if (!_.isString(resp.headers.link) || !_.includes(resp.headers.link, 'rel="next"')) {
          debug('Stopping');
          return stop();
        }

        // e.g.  resp.headers.link ='<https://api.github.com/organizations/216094/repos?access_token=TOKEN&type=private&page=2>; rel="next", <https://api.github.com/organizations/216094/repos?access_token=TOKEN&type=private&page=2>; rel="last"',    //
        memo.url = resp.headers.link.split(';')[0].slice(1, -1).trim();

        next(null, memo);
      })

    }, function done(err, memo) {
      if (err) {
        return reject(err);
      }

      if (!_.isArray(memo.repositories) || memo.repositories.length === 0) {
        return reject(Error('Github seems to have changed their api, no repositories where found, please update this app'));
      }

      return resolve(memo.repositories);
    });
  });

}

module.exports = getRepos;

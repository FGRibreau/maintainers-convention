'use strict';
// This mini-app was written in a quick & Dirty way
// we don't care about code quality here, we just want it to work.

const _ = require('lodash');
const request = require('requestretry');
const assert = require('assert');
const async = require('async');

const guard = require('when/guard');
const when = require('when');

const getRepos = require('./getRepos');
const getFile = require('./getFile');

module.exports = function(config) {
  assert(_.isString(config.github.organisation));
  assert(_.isString(config.github.token));
  assert(_.isString(config.maintainers.filename));

  const repositories = getRepos(config.github.organisation, config.github.token);
  // const repositories = when(JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../repositories.json'), 'utf8')));


  const getMaintainerFile = (repository) => getFile(config.github.token, repository.contents_url.replace('{+path}', config.maintainers.filename));

  return repositories.then(repositories => {
    return when.promise((resolve, reject) => {
      // as of v3.7.7 when/guard is full of bugs, so I use async instead
      // no more than 10 requests in parallel
      async.mapLimit(repositories, 10, (repository, f) => {
        getMaintainerFile(repository).done(
          maintainers => f(null, {
            repository: repository,
            maintainers: maintainers
          }),
          err => f(err)
        );
      }, (err, repositoriesWithMaintainers) => {
        if (err) {
          return reject(err);
        }

        resolve(repositoriesWithMaintainers);
      });
    });
  });

};

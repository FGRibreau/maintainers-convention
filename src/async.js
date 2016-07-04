const async = require('async');

/**
 * foldUntil, fold until `stop()` or `next(error)` is called
 * @param  {Mixed} the initial state of the reduction
 * @param  {Function} iterator(memo:Mixed, next:Function(err:{Error,Null}, memo:Mixed), stop:Function())
 * @param  {Function} fDone(err:Error,Null, data:Array)  a callback which is called after all the iterator functions have finished. Result is the reduced value.
 */
async.foldUntil = function(memo, fIterator, fDone) {
  const STOP_SENTINEL = {};
  async.forever(function iter(_next) {
      fIterator(memo, function next(err, data) {
        if (err) {
          return _next(err);
        }
        memo = data;
        _next();
      }, function stop() {
        _next(STOP_SENTINEL);
      })
    },
    function(err) {
      if (err === STOP_SENTINEL) {
        return fDone(null, memo);
      }
      fDone(err || null, memo);
    }
  );
};

module.exports = async;

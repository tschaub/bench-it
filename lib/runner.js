var path = require('path');
var util = require('util');

var Benchmark = require('./benchmark').Benchmark;


function iterate(files, current, callback) {
  var file = files[current];
  if (!file) {
    return callback(null);
  }
  var benchmark;
  try {
    var config = require(path.resolve(file));
    benchmark = new Benchmark(config);
  } catch (err) {
    return callback(new Error(
        util.format('Benchmark failed: %s\n%s', file, err.message)));
  }
  var emitter = benchmark.run();
  emitter.on('error', function(err) {
    callback(new Error(
        util.format('Benchmark failed: %s\n%s', file, err.message)));
  });

  emitter.on('done', function(calls, elapsed, reporter) {
    var message;
    if (reporter) {
      try {
        message = reporter(calls, elapsed);
      } catch (err) {
        callback(new Error(
            util.format('Reporter failed: %s\n%s', file, err.message)));
        return;
      }
    } else {
      message = util.format('%s %d ops/sec\n',
          path.basename(file), Math.floor(calls / (elapsed / 1e9)));
    }
    if (message) {
      process.stdout.write(message);
    }
    ++current;
    iterate(files, current, callback);
  });
}


/**
 * Run a series of benchmarks.
 * @param {Array.<string>} files Array of paths to benchmark modules.
 */
module.exports = function(files) {
  iterate(files, 0, function(err) {
    if (err) {
      process.stderr.write(err.message + '\n');
      process.exit(1);
    }
    process.exit(0);
  });
};

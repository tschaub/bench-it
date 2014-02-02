var path = require('path');

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
    return callback(err);
  }
  var emitter = benchmark.run();
  emitter.on('error', callback);
  // TODO: introduce reporter
  emitter.on('data', function(nanoseconds) {
    console.log('run', file, nanoseconds);
  });
  emitter.on('done', function(calls, elapsed) {
    console.log('completed', file, calls, elapsed);
    ++current;
    iterate(files, current, callback);
  });
}


/**
 * Run a series of benchmarks.
 * @param {Array.<string>} files Array of paths to benchmark modules.
 */
var exports = module.exports = function(files) {
  iterate(files, 0, function(err) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log('Done!');
    process.exit(0);
  });
};

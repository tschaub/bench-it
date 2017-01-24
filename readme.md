# `bench-it`

[![Greenkeeper badge](https://badges.greenkeeper.io/tschaub/bench-it.svg)](https://greenkeeper.io/)

Simple benchmark runner.

## Install

Install with `npm`.

```
npm install -g bench-it
```

## Create a module with a function to benchmark

A benchmark is a module that exports a `test` function.

Example `simple.js` benchmark:

```js
exports.test = function() {
  // function to benchmark
};
```

## Establish a benchmark

```
bench simple.js
```

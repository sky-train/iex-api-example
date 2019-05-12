'use strict';
const assert = require('assert');
const { Router, RouterPath } = require('../lib/router');

const  testPath = '/ticker/:symbol'
let    rp       = null;
let    req      = {}

describe('router', ()=> {

  it('create RoutPath',()=> {
    rp = new RouterPath(testPath);
    assert.equal(rp.params.length,1);
    assert.equal(rp.params[0], 'symbol');

  });

  it('RouterPath successful', ()=> {
    rp.test(req, '/ticker/symbol1');
    assert.equal(req.params.symbol, 'symbol1');
  });

  it('RouterPath unsuccessful', ()=> {
    let result = rp.test(req, '/ticker/other/data');
    assert.equal(result, null);
  });
});
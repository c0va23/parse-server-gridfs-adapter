'use strict'

const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it

const assert = require('assert')

const MongoGridAdapter = require('../index')

describe('MongoGridAdapter', function () {
  describe('constructor', function () {
    const createAdapter = options => new MongoGridAdapter(options)

    it('raise exception if not pass arguments', function () {
      assert.throws(function () {
        createAdapter()
      })
    })

    it('raise exception if pass object without mongoURL field', function () {
      assert.throws(function () {
        createAdapter({})
      })
    })

    it('raise exception if pass object with empty mongoURL field', function () {
      assert.throws(function () {
        createAdapter({mongoURL: null})
      })
    })

    it('not raise exception if pass object with mongoURL field', function () {
      assert.doesNotThrow(function () {
        createAdapter({mongoURL: 'mongodb url'})
      })
    })
  })
})

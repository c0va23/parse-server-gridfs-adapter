'use strict'

const mocha = require('mocha')
const describe = mocha.describe
const context = mocha.describe
const beforeEach = mocha.beforeEach
const after = mocha.after
const it = mocha.it

const assert = require('assert')

const MongodbHelper = require('./helpers/mongodb')

const MongoGridAdapter = require('../index')

describe('MongoGridAdapter', function () {
  beforeEach(() => MongodbHelper.clearFiles())
  after(() => MongodbHelper.clearFiles())

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

  describe('#createFile', function () {
    context('when adapter initialize is failled', function () {
      const adapter = new MongoGridAdapter({mongoURL: 'fake url'})

      it('result is rejected', function () {
        return new Promise(function (resolve, reject) {
          adapter.createFile('filename', 'data').then(reject).catch(resolve)
        })
      })
    })

    context('when adapter initialized is successfully', function () {
      const adapter = new MongoGridAdapter({
        mongoURL: MongodbHelper.MONGODB_URL
      })

      context('when file is exist', function () {
        const fileName = 'filename'
        const buffer = 'any data'

        beforeEach(() => MongodbHelper.createFile(fileName, buffer))

        it('result is rejected', function () {
          return new Promise(function (resolve, reject) {
            return adapter.createFile(fileName, buffer)
              .then(reject).catch(resolve)
          })
        })
      })

      context('when file not exist', function () {
        it('result is fulfillment', function () {
          return adapter.createFile('filename', 'data')
        })

        it('create file into mongo', function () {
          return adapter.createFile('file', 'data')
                        .then(() => MongodbHelper.fileExist('file'))
                        .then(exist => assert(exist, 'File not created'))
        })
      })
    })
  })
})

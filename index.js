'use strict'

const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket

function MongoGridAdapter (options) {
  options = options || {}
  this._mongoURL = options.mongoURL
  if (!this._mongoURL) {
    throw new Error('option "mongoURL" is required')
  }
}

MongoGridAdapter.prototype._connect = function () {
  if (undefined === this._connectionPromise) {
    this._connectionPromise = MongoClient.connect(this._mongoURL)
  }
  return this._connectionPromise
}

MongoGridAdapter.prototype._bucket = function () {
  if (undefined === this._bucketPromise) {
    this._bucketPromise = this._connect()
      .then(database => new GridFSBucket(database))
  }
  return this._bucketPromise
}

MongoGridAdapter.prototype._fileExist = function (filename) {
  return this._bucket()
    .then(bucket => bucket.find({filename: filename}).count())
    .then(count => count === 1)
}

MongoGridAdapter.prototype.createFile =
  function (filename, dataBuffer) {
    return this._fileExist(filename)
      .then(exist => {
        if (!exist) return this._bucket()
        return Promise.reject(new Error(`File "${filename}" already exist`))
      })
      .then(bucket => bucket.openUploadStream(filename))
      .then(writeStream =>
        new Promise(function (resolve, reject) {
          writeStream.once('finish', resolve)
          writeStream.once('error', reject)
          writeStream.end(dataBuffer)
        })
      )
  }

module.exports = MongoGridAdapter

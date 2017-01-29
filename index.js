'use strict'

const MongoClient = require('mongodb').MongoClient
const GridStore = require('mongodb').GridStore

function MongoGridAdapter (options) {
  options = options || {}
  this._mongoURL = options.mongoURL
  if (!this._mongoURL) {
    throw new Error('option "mongoURL" is required')
  }
}

MongoGridAdapter.prototype._connect = function () {
  if (!this._connectionPromise) {
    this._connectionPromise = MongoClient.connect(this._mongoURL)
  }
  return this._connectionPromise
}

MongoGridAdapter.prototype.createFile = function (filename, data) {
  return this._connect()
    .then(database => {
      const gridStore = new GridStore(database, filename, 'w')
      return gridStore.open()
    })
    .then(gridStore => gridStore.write(data))
    .then(gridStore => gridStore.close())
}

module.exports = MongoGridAdapter

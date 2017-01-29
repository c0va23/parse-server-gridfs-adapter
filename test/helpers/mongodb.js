'use strict'

const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket

const MONGODB_URL = 'mongodb://mongo/parse_server_gridfs_adapter'

let _connectionPromise

function connection () {
  if (undefined === _connectionPromise) {
    _connectionPromise = MongoClient.connect(MONGODB_URL)
  }
  return _connectionPromise
}

let _bucketPromise

function bucket () {
  if (undefined === _bucketPromise) {
    _bucketPromise = connection().then(database => new GridFSBucket(database))
  }
  return _bucketPromise
}

function clearFiles () {
  return bucket()
    .then(bucket =>
      bucket.find().map(document =>
        bucket.delete(document._id)
      ).toArray()
    )
    .then(results => Promise.all(results))
}

function fileExist (filename) {
  return bucket().then(bucket => bucket.find({filename: filename}).count())
                 .then(count => count === 1)
}

module.exports = {
  MONGODB_URL: MONGODB_URL,
  clearFiles: clearFiles,
  fileExist: fileExist
}

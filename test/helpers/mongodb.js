'use strict'

const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket

const MONGODB_URI = process.env.MONGODB_URI

let _connectionPromise

function connection () {
  if (undefined === _connectionPromise) {
    _connectionPromise = MongoClient.connect(MONGODB_URI)
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

function fileExist (filename, contentType) {
  let query = undefined !== contentType
    ? {filename: filename, contentType: contentType}
    : {filename: filename}
  return bucket().then(bucket => bucket.find(query).count())
                 .then(count => count === 1)
}

function createFile (filename, dataBuffer) {
  return bucket()
    .then(bucket => bucket.openUploadStream(filename))
    .then(writeStream =>
      new Promise(function (resolve, reject) {
        writeStream.once('finish', resolve)
        writeStream.once('error', reject)
        writeStream.end(dataBuffer)
      })
    )
}

module.exports = {
  MONGODB_URI: MONGODB_URI,
  clearFiles: clearFiles,
  fileExist: fileExist,
  createFile: createFile
}

'use strict';

function MongoGridAdapter(options) {
  options = options || {};
  this._mongoURL = options.mongoURL;
  if(!this._mongoURL) {
    throw new Error("option mongoURL is required");
  }
}

module.exports = MongoGridAdapter;

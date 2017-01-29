const assert = require('assert');

const MongoGridAdapter = require('../index');

describe('MongoGridAdapter', function() {
  describe('constructor', function() {
    it('raise exception if not pass arguments', function() {
      assert.throws(function() {
        new MongoGridAdapter();
      });
    });

    it('raise exception if pass object without mongoURL field', function() {
      assert.throws(function() {
        new MongoGridAdapter({});
      });
    });

    it('raise exception if pass object with empty mongoURL field', function() {
      assert.throws(function() {
        new MongoGridAdapter({mongoURL: null});
      });
    });

    it('not raise exception if pass object with mongoURL field', function() {
      assert.doesNotThrow(function() {
        new MongoGridAdapter({mongoURL: 'mongodb url'});
      });
    });
  });
});

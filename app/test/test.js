var router = require("../routes/")
var assert = require('assert');


describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});


describe('router', function(){
  describe('get(/)', function(){
    it('Hello mocha', function(){
      var msg = 'mocha';
      assert.equal('Hello ' + msg, router.hello(msg));
    })
  })
})

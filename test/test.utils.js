var Utils = require('../lib/utils.js');


describe('Test Utils objLength function', function (){

  it('check if new props are not ommited in test',function (done){
    
    var methods = ['objLength'];

    for (var prop in Utils){
      if ( methods.indexOf(prop) === -1 ) return;
    }

    done();

  });

  it('Should count keys in a iteration array', function (done) {

    var keysCount;
    var testArr = Array();


    testArr['a'] = {a:'a', b: 'b'};
    testArr['b'] = {a:'a', b: 'b'};

    keysCount = Utils.objLength(testArr);

    keysCount.should.be.equal(2);

    done();

  });

  it('Should handle empty array', function (done) {

    var keysCount;
    var testArr = Array();


    testArr = null;

    keysCount = Utils.objLength(testArr);

    keysCount.should.be.equal(0);

    done();

  });

  it('Should count keys in a iteration array with different key types', function (done) {

    var keysCount;
    var testArr = Array();


    testArr['a'] = {a:'a', b: 'b'};
    testArr['b'] = {a:'a', b: 'b'};

    testArr.push({a:'a'});

    keysCount = Utils.objLength(testArr);

    keysCount.should.be.equal(3);

    done();

  });

});
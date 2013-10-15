var Group = require('../lib/group.js')

describe('Test single group object with proper init values', function () {

  var group = new Group({
    url : 'http://passb.herokuapp.com',
    watchCount : 0
  });

  it('check if new props are not ommited in test',function (done){
    
    var methods = [
      'getCount',
      'increaseCount',
      'decreaseCount',
      'increaseRefresh',
      'url',
      'watchCount',
      'refreshCount'
      ];

    for (var prop in group){
      if ( methods.indexOf(prop) === -1 ) return;
    }

    done();

  });

  it('Get watch count ', function (done) {

    group.getCount().should.be.a('number');
    
    done();

  });

  it('Increase watch count ', function (done) {

    group.increaseCount();

    group.getCount().should.be.a('number');
    group.getCount().should.be.above(0).equal(1);
    
    done();

  });

  it('Decrease watch count ', function (done) {

    group.decreaseCount();

    group.getCount().should.be.a('number');
    group.getCount().should.be.equal(0);
    
    done();

  });

  it('Increase resfresh count', function (done) {

    var 
      rc = group.refreshCount
      , rc2;

    group.increaseRefresh();

    rc2 = group.refreshCount;

    rc2.should.be.above(rc);

    done();

  })

});
var SingleWatch = require('../lib/singleWatch.js')

describe('Test single watch object', function () {

  var sw = new SingleWatch({
    url : 'http://passb.herokuapp.com',
    watchCount : 0
  });

  it('Get watch count ', function (done) {

    sw.getWatchCount().should.be.a('number');
    
    done();

  });

  it('Increase watch count ', function (done) {

    sw.increaseWatchCount();

    sw.getWatchCount().should.be.a('number');
    sw.getWatchCount().should.be.above(0);
    
    done();

  });

    it('Decrease watch count ', function (done) {

    sw.decreaseWatchCount();

    sw.getWatchCount().should.be.a('number');
    sw.getWatchCount().should.be.equal(0);
    
    done();

  });

});
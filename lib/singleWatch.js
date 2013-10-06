var SingleWatch = function (initData) {
  
  this.url = initData.url;

  this.watchCount = initData.watchCount;

  
};
SingleWatch.prototype.getWatchCount = function () {
  return this.watchCount;
};
SingleWatch.prototype.increaseWatchCount = function () {
  this.watchCount++;
};
SingleWatch.prototype.decreaseWatchCount = function () {
  this.watchCount--;
};

module.exports = SingleWatch;
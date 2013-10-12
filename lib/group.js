var Group = function (initData) {
  
  this.url = initData.url;

  this.watchCount = initData.watchCount;


};
Group.prototype.getCount = function () {
  return this.watchCount;
};
Group.prototype.increaseCount = function () {
  this.watchCount++;
};
Group.prototype.decreaseCount = function () {
  this.watchCount--;
};

module.exports = Group;
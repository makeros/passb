var Group = function (initData) {
  
  this.url = initData.url;

  this.watchCount = initData.watchCount;

  this.refreshCount = 0;

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
Group.prototype.increaseRefresh = function () {
  this.refreshCount++;
};

module.exports = Group;
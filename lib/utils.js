var Utils;

Utils = {

  objLength : function objectLength(obj) {
    
    var result = 0;
    
    for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
      // or Object.prototype.hasOwnProperty.call(obj, prop)
        result++;
      }
    }
    return result;

  },

};

module.exports = Utils;
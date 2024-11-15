class Util {
  static merge(...args) {
    var merged = {};
    var argsLen = args.length;
    for (var i = 0; i < argsLen; i++) {
      var obj = args[i];
      for (var key in obj) {
        merged[key] = obj[key];
      }
    }
    return merged;
  }
}
export default Util;

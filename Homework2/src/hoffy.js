// hoffy.js
const fs = require('fs');
const rev = {

  prod: function(...numN) {
    const numArray = numN;
    if(numArray.length === 0) {
      return undefined;
    } else {
      return numArray.reduce((a, b) => a * b);
    }
  },

  any: function(arr, fn) {
    const filtered = arr.filter(fn);
    if(!(filtered.length === 0)) {
      return true;
    } else {
      return false;
    }
  },

  maybe: function(fn) {
    return function(...arg) {
      const words = arg;
      const filteredWords = words.filter(function(word) {
        return word !== null && word !== undefined;
      });
      let value;
      if(filteredWords.length < 2) {
        return undefined;
      } else {
        value = fn(...arg);
      }
      return value;
    };
  },

  constrainDecorator: function(fn, min, max) {
    const cache = {};
    function oldFunction(...args) {
      const n = args;
      let res;
      if(cache[n] === undefined) {
        res = fn(...args);
        cache[n] = res;
      } else {
        res = cache[n];
      }
      if(min !== undefined && max !== undefined) {
        if (res >= min && res <= max) {
          return res;
        } else if(res < min && res < max){
          return min;
        } else if (res > min && res > max) {
          return max;
        }
      } else {
        return res;
      }
    }
    return oldFunction;
  },

  limitCallsDecorator: function(fn, n) {
    const cache = {};
    let count = 0;
    function oldFunction(...args) {
      const arg = args;
      let res;
      if(cache[arg] === undefined) {
        res = fn(...args);
        cache[arg] = res;
      } else {
        res = cache[arg];
      }
      count += 1;
      if(count > n) {
        return undefined;
      } else {
      return res;
      }
    } return oldFunction;
  },

  mapWith: function(fn) {
    let arr = [];
    return function(x) {
      arr = x;
      return arr.map(fn);
    };
  },

  simpleINIParse: function(s) {
    const lines = s.split(/\r\n|\r|\n/);
    const obj = {};
    const newArray = lines.map(function(word) {
      return word.split('=');
    });
    newArray.filter(function(res) {
      if(res.length > 1) {
        const key = res[0];
        obj[key] = res[1];
      }
    });
    return obj;
  },

  readFileWith: function(fn) {
    const f = rev.mapWith(fn);
    function newFunction(fileName, f) {
      fs.readFile(fileName, 'utf8', function(err, data) {
        let parsedData = "";
        if (err) {
          parsedData = undefined;
        } else {
          parsedData = fn(data);
        }
        f(err, parsedData);
     });
   }
   return newFunction;

  }


};

module.exports = rev;

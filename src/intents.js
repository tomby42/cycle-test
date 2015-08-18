let intents = {};
let ctors = [];

var service = {
  register: function (name, ctor) {
    ctors.push ([name, ctor]);
  },

  init: function (interactions) {
    ctors.forEach (([name, ctor]) => intents[name] = ctor (interactions));

    return intents;
  }
};

module.exports = service;

var ConsoleSignaling = function() {};

ConsoleSignaling.prototype = {
  send: function(message) {
    console.log(JSON.stringify(message));
  }
};
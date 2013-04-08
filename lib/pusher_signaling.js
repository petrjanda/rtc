var PusherSignaling = function() {
  this.pusher = new Pusher('2cd60bc764bca119d7bd');
  this.channel = this.pusher.subscribe('private-test');
};

PusherSignaling.prototype = {
  send: function(event, message) {
    this.channel.trigger('client-' + event, message);
  },

  subscribe: function(event, callback) {
    this.channel.bind('client-' + event, callback);
  }
};
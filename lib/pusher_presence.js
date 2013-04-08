var PusherPresence = function(callback) {
  var self = this;

  this.callback = callback;

  this.pusher = new Pusher('2cd60bc764bca119d7bd');
  this.presenceChannel = this.pusher.subscribe('presence-test');
  this.presenceChannel.bind('pusher:subscription_succeeded', function() {
    callback(self.presenceChannel.members.count > 1);
  });

  this.presenceChannel.bind('pusher:member_added', function(member) {
    callback(self.presenceChannel.members.count > 1);
  });

  this.presenceChannel.bind('pusher:member_removed', function(member) {
    callback(self.presenceChannel.members.count > 1);
  });
};

PusherPresence.prototype = {
};
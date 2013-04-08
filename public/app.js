var ConsoleSignaling = function() {};

ConsoleSignaling.prototype = {
  send: function(message) {
    console.log(JSON.stringify(message));
  }
};var PusherPresence = function(callback) {
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
};var PusherSignaling = function() {
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
};var RTCPeerConnection = function(signaling) {
  this.signaling = signaling;
};

RTCPeerConnection.prototype = {
  connect: function(url) {
    var self = this;
    var config = { iceServers: [{ url: url}] };

    this._connection = new webkitRTCPeerConnection(config);

    this._connection.onicecandidate = function(event) {
      self.signaling.send('candidate', event.candidate);
    };

    // once remote stream arrives, show it in the remote video element
    this._connection.onaddstream = function(event) {
      var url = webkitURL.createObjectURL(event.stream);
      var video = document.getElementById('remote');
      console.log(event.stream);
      console.log(window.URL.createObjectURL(event.stream));
      video.src = window.URL.createObjectURL(event.stream);
    };
  },

  streamOffer: function(stream) {
    var self = this;

    this._connection.addStream(stream);

    this._connection.createOffer(function(desc) {
      self._connection.setLocalDescription(desc);
      self.signaling.send('offer', desc);
    });
  },

  addStream: function(stream) {
    this._connection.addStream(stream);
  },
 
  answer: function(data) {
    var self = this;

    this._connection.setRemoteDescription(new RTCSessionDescription(data));
    this._connection.createAnswer(function(sessionDescription) {
      self._connection.setLocalDescription(sessionDescription);
      //self._connection.startIce();
      self.signaling.send('answer', sessionDescription);
    });
  },

  addIceCandidate: function(data) {
    var data = {
      sdpMLineIndex:data.sdpMLineIndex, 
      candidate:data.candidate
    };

    console.log(data)

    var candidate = new RTCIceCandidate(data);
    this._connection.addIceCandidate(candidate);
  },

  answered: function(data) {
    this._connection.setRemoteDescription(new RTCSessionDescription(data));
    // this._connection.startIce();
  }
};var UserMedia = function() {};

UserMedia.prototype = {
  isSupported: function() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
  },

  get: function(options, onSuccess, onFailed) {
    options = options || {video: true, audio: true};
    onFailed = onFailed || function() {}

    navigator.webkitGetUserMedia(options, onSuccess, onFailed);
  }
};var VideoCall = function() {
  var self = this;

  this.signaling = new PusherSignaling();
  this.rtc = new RTCPeerConnection(this.signaling);
  this.media = new UserMedia();

  this.rtc.connect('stun:stun.l.google.com:19302');

  this.signaling.subscribe('offer', function(data) {
    self.answer(data);
  })

  this.signaling.subscribe('answer', function(data) {
    self.rtc.answered(data);
  })

  this.signaling.subscribe('candidate', function(data) {
    self.rtc.addIceCandidate(data);
  })
};

VideoCall.prototype = {
  call: function(user) {
    var self = this;

    this.media.get({video: true}, function(stream) { 
      $('#call').hide();
      self.onSuccess(stream);
    });
  },

  answer: function(data) {
    var self = this;

    this.media.get({video: true}, function(stream) { 
      var video = document.getElementById('local');
      video.src = window.URL.createObjectURL(stream);

      $('#call').hide();
      self.rtc.addStream(stream);
      self.rtc.answer(data);
    });
  },

  onSuccess: function(stream) {
    var video = document.getElementById('local');
    video.src = window.URL.createObjectURL(stream);

    this.rtc.streamOffer(stream);
  }
};
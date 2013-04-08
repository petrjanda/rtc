var VideoCall = function() {
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
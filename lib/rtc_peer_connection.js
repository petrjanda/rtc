var RTCPeerConnection = function(signaling) {
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
};
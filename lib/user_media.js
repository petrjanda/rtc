var UserMedia = function() {};

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
};
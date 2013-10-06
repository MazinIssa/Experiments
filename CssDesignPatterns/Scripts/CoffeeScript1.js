(function() {
  var VideoPlayer,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.VideoPlayer = VideoPlayer = (function() {
    VideoPlayer.prototype.beforeChangeStyle = {};

    VideoPlayer.prototype.updateLanguage = function() {
      var bar;

      this.srt = this.src.replace(".mp4", "-" + this.currentLang + ".vtt");
      this.track.attr({
        "default": "default",
        kind: "subtitles",
        src: this.srt,
        srclang: this.currentLang,
        label: this.currentLang
      });
      this.videoElement.detach();
      this.tightContainer.prepend(this.videoElement);
      this.container.find(".videosub-container").remove();
      this.container.find(".videosub-bar").remove();
      this.videoElement.videoSub();
      bar = this.container.find(".videosub-bar").css({
        padding: "0",
        width: "100%",
        left: 0
      }).detach();
      this.tightContainer.append(bar);
      return null;
    };

    VideoPlayer.prototype.setLanguage = function(langCode) {
      this.currentLang = langCode;
      this.updateLanguage();
      return null;
    };

    VideoPlayer.prototype.setSource = function(src) {
      this.src = src;
      this.videoElement.attr({
        src: this.src,
        type: "video/mp4"
      });
      this.updateLanguage();
      return null;
    };

    VideoPlayer.prototype.setPoster = function(image) {
      this.videoElement.attr({
        poster: image
      });
      return null;
    };

    VideoPlayer.prototype.detach = function() {
      this.tightContainer.detach();
      return true;
    };

    VideoPlayer.prototype.attach = function() {
      return this.container.append(this.tightContainer);
    };

    VideoPlayer.prototype.createEventHandler = function(jQElement, callback) {
      var _this = this;

      return function(e) {
        var desiredPercentage, pageSth, tl;

        pageSth = "page" + (_this.isFullScreen ? 'Y' : 'X');
        tl = _this.isFullScreen ? 'top' : 'left';
        if (e.originalEvent.touches != null) {
          desiredPercentage = (e.originalEvent.touches[0][pageSth] - jQElement.offset()[tl]) / jQElement.width();
        } else if (e.originalEvent.pageX != null) {
          desiredPercentage = (e.originalEvent[pageSth] - jQElement.offset()[tl]) / jQElement.width();
        }
        desiredPercentage = desiredPercentage > 1 ? 1 : desiredPercentage < 0 ? 0 : desiredPercentage;
        callback(desiredPercentage);
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
    };

    VideoPlayer.prototype.initVolumeControls = function() {
      var _this = this;

      this.volumeControls = $("<div class='volume-controls'>");
      this.timeSpan = $("<div class='time-div'>00:00</div>");
      this.fullScreenButton = $("<input type='button' class='button fullscreen-button'>").html("").click(function() {
        return _this.enterFullScreenMode();
      });
      return this.volumeControls.append(this.timeSpan.append(this.fullScreenButton));
    };

    VideoPlayer.prototype.initVideoProgress = function() {
      var videoProgressHandler,
        _this = this;

      this.progressContainer = $("<div class='progress-container'>");
      videoProgressHandler = this.createEventHandler(this.progressContainer, function(percentage) {
        var desiredTime;

        desiredTime = (_this.videoElement[0].duration * percentage).toFixed(0);
        _this.videoElement[0].currentTime = desiredTime;
        return null;
      });
      this.progressContainer.bind(this.eventsToUse[0], videoProgressHandler);
      return this.progressContainer.bind(this.eventsToUse[1], videoProgressHandler);
    };

    function VideoPlayer(container, options) {
      var buttonsDiv, someDiv,
        _this = this;

      this.container = container;
      this.createEventHandler = __bind(this.createEventHandler, this);
      this.attach = __bind(this.attach, this);
      this.detach = __bind(this.detach, this);
      this.setPoster = __bind(this.setPoster, this);
      this.setSource = __bind(this.setSource, this);
      this.setLanguage = __bind(this.setLanguage, this);
      this.updateLanguage = __bind(this.updateLanguage, this);
      if (options) {
        this.src = options.src;
      }
      this.currentLang = options && options.lang ? options.lang : 'en';
      if (options) {
        this.poster = options.poster;
      }
      if (options) {
        this.onFullscreen = options.onFullscreen;
      }
      if (options) {
        this.offFullscreen = options.offFullscreen;
      }
      this.playing = false;
      this.isFullScreen = false;
      this.videoControls = $("<div>").addClass("video-controls");
      this.playButton = $("<input type='button' class='button play-button'>").html("").bind("click", function() {
        return _this.play();
      });
      this.progressBar = $("<p class='progress-bar'>");
      this.srtButton = $("<input type='button' class='button subtitles-button'/>").bind('click', function() {
        _this.srtButton.toggleClass("off");
        return _this.container.find(".videosub-bar").toggle();
      });
      buttonsDiv = $("<div class='video-controls-buttons'/>").append(this.playButton).append(this.srtButton);
      someDiv = $("<div class='progress-div'>").append(this.progressBar);
      this.eventsToUse = navigator.userAgent.match(/Android/i) || VideoPlayer.is_touch_device() ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];
      this.initVideoProgress().append(someDiv);
      this.initVolumeControls();
      this.videoControls.append(buttonsDiv).append(this.progressContainer).append(this.volumeControls);
      this.track = $("<track/>");
      this.videoElement = $("<video webkit-playsinline>").addClass("video-element").bind("durationchange", function() {
        return _this.duration = _this.videoElement[0].duration;
      }).bind("timeupdate", function() {
        var minutes, minutesZero, percentComplete, secondsZero, text, totalSeconds;

        totalSeconds = Math.floor(_this.videoElement[0].currentTime);
        minutes = Math.floor(totalSeconds / 60);
        minutesZero = minutes < 10 ? "0" : "";
        totalSeconds %= 60;
        secondsZero = totalSeconds < 10 ? "0" : "";
        text = "" + (minutesZero + minutes.toString()) + ":" + (secondsZero + totalSeconds.toString());
        _this.timeSpan.text(text);
        percentComplete = (_this.videoElement[0].currentTime / _this.duration * 100).toFixed(2);
        _this.progressBar.css({
          'width': percentComplete + '%'
        });
        return false;
      }).bind("ended", function() {
        _this.playButton.removeClass('paused');
        _this.playing = false;
        return false;
      }).append(this.track);
      if (this.poster != null) {
        this.setPoster(this.poster);
      }
      this.tightContainer = $("<div>").addClass("tight-container").append(this.videoElement).append(this.videoControls).height(200);
      this.container.addClass('video-container').append(this.tightContainer);
      if (this.src != null) {
        this.setSource(this.src);
      }
    }

    VideoPlayer.saveStyle = function(saveObject, fromThis, min) {
      saveObject.width = fromThis.css('width');
      saveObject.height = fromThis.css('height');
      saveObject.position = fromThis.css('position');
      if (!min) {
        return saveObject.tlbr = {
          top: fromThis.css('top'),
          left: fromThis.css('left'),
          bottom: fromThis.css('bottom'),
          right: fromThis.css('right')
        };
      }
    };

    VideoPlayer.is_touch_device = function() {
      return 'ontouchstart' in window || 'onmsgesturechange' in window;
    };

    VideoPlayer.restoreStyle = function(toThis, fromSaveObject) {
      toThis.css('width', fromSaveObject.width);
      toThis.css('height', fromSaveObject.height);
      return toThis.css('position', fromSaveObject.position);
    };

    VideoPlayer.stretch = function(me) {
      me.css({
        width: window.innerHeight,
        height: window.innerWidth,
        position: 'absolute',
        top: 0,
        left: 0
      });
      return me.addClass('stretched');
    };

    VideoPlayer.prototype.enterFullScreenMode = function() {
      this.fullScreenButton.toggleClass('un');
      if (!this.isFullScreen) {
        this.isFullScreen = true;
        this.beforeChangeStyle.tc = {};
        VideoPlayer.saveStyle(this.beforeChangeStyle.tc, this.tightContainer, true);
        VideoPlayer.stretch(this.tightContainer);
        if (this.onFullscreen) {
          this.onFullscreen();
        }
      } else {
        this.isFullScreen = false;
        VideoPlayer.restoreStyle(this.tightContainer, this.beforeChangeStyle.tc);
        this.tightContainer.removeClass('stretched');
        if (this.offFullscreen) {
          this.offFullscreen();
        }
      }
      return null;
    };

    VideoPlayer.prototype.play = function() {
      this.playButton.toggleClass('paused');
      if (this.playing) {
        this.playing = false;
        return this.videoElement[0].pause();
      } else {
        this.playing = true;
        return this.videoElement[0].play();
      }
    };

    return VideoPlayer;

  })();

}).call(this);

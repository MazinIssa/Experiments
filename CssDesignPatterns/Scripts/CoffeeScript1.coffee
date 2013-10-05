#Creates a <video> and other HTML in container
window.VideoPlayer = class VideoPlayer
  beforeChangeStyle: {} #used to save some properties before changing them to go to fullscreen mode

  updateLanguage: =>
    @srt = @src.replace(".mp4", "-" + @currentLang + ".vtt")
    @track.attr(
      "default":"default",
      kind:"subtitles",
      src: @srt,
      srclang:@currentLang,
      label:@currentLang
    )
    @videoElement.detach()
    @tightContainer.prepend(@videoElement)
    @container.find(".videosub-container").remove()
    @container.find(".videosub-bar").remove()
    @videoElement.videoSub()
    bar = @container.find(".videosub-bar").css({padding:"0", width:"100%", left:0}).detach()
    @tightContainer.append(bar);
    return null;

  setLanguage: (langCode) =>
    @currentLang = langCode
    @updateLanguage()
    return null;

  setSource: (@src) =>
    @videoElement.attr({src:@src, type:"video/mp4"})
    @updateLanguage()
    return null;

  setPoster: (image) =>
    @videoElement.attr({poster:image})
    return null;

  detach: () =>
    @tightContainer.detach()
    return true

  attach: () => @container.append(@tightContainer);

  #createEventHandler is a function that returns an event handler that calls a callback.
  #this is used to handle more than one progress bar the same way
  createEventHandler: (jQElement, callback) =>
    (e) =>
      pageSth = "page" + (if @isFullScreen then 'Y' else 'X')
      tl = if @isFullScreen then 'top' else 'left'
      if e.originalEvent.touches?
        desiredPercentage = (e.originalEvent.touches[0][pageSth] - jQElement.offset()[tl]) / jQElement.width();
      else if e.originalEvent.pageX?
        desiredPercentage = (e.originalEvent[pageSth] - jQElement.offset()[tl]) / jQElement.width();
      desiredPercentage = if desiredPercentage > 1 then 1 else if desiredPercentage < 0 then 0 else desiredPercentage
      callback(desiredPercentage)
      e.preventDefault()
      e.stopPropagation()
      return false

  #includes full screen button and time span
  initVolumeControls: ->
    #volume controls are actually all the controls on the right of the video progress bar
    @volumeControls = $("<div class='volume-controls'>");

    @timeSpan = $("<div class='time-div'>00:00</div>")
    @fullScreenButton = $("<input type='button' class='button fullscreen-button'>").html("").click(=> @enterFullScreenMode());

    @volumeControls
    .append @timeSpan
    .append @fullScreenButton

  initVideoProgress: ->
    @progressContainer = $("<div class='progress-container'>")
    videoProgressHandler = @createEventHandler @progressContainer, (percentage) =>
        desiredTime = (@videoElement[0].duration * percentage).toFixed(0);
        @videoElement[0].currentTime = desiredTime; #reseek will update progress-bar css width
        return null
    @progressContainer.bind(@eventsToUse[0], videoProgressHandler)
    @progressContainer.bind(@eventsToUse[1], videoProgressHandler)

  #container:element in which to put video
  #src:url of video source e.g. xyz.mp4
  #srt:url of srt subtitles
  #set width and height via CSS: tight-container and video-element
  constructor: (@container, options) ->
    @src = options.src if options
    @currentLang = if options and options.lang then options.lang else 'en'
    @poster = options.poster if options
    @onFullscreen = options.onFullscreen if options
    @offFullscreen = options.offFullscreen if options
    @playing = false;
    @isFullScreen = false;
    #init controls
    @videoControls = $("<div>").addClass("video-controls");

    @playButton = $("<input type='button' class='button play-button'>").html("").bind("click", => @play());
    @progressBar = $("<p class='progress-bar'>");
    #create select and <track> elements to add to <video>
    @srtButton = $("<input type='button' class='button subtitles-button'/>").bind('click',
    =>
      @srtButton.toggleClass("off")
      @container.find(".videosub-bar").toggle()
    )
    buttonsDiv = $("<div class='video-controls-buttons'/>")
    .append(@playButton)
    .append(@srtButton)
    someDiv = $("<div class='progress-div'>").append(@progressBar);

    @eventsToUse = if navigator.userAgent.match(/Android/i) || VideoPlayer.is_touch_device() then ["touchstart", "touchmove", "touchend"] else ["mousedown", "mousemove", "mouseup"];

    @initVideoProgress().append(someDiv)
    @initVolumeControls()

    @videoControls
    .append(buttonsDiv)
    .append(@progressContainer)
    .append(@volumeControls)

    #create video element
    @track = $("<track/>")
    @videoElement=$("<video webkit-playsinline>").addClass("video-element")
    .bind("durationchange", => @duration = @videoElement[0].duration)
    .bind("timeupdate",
      =>
        totalSeconds = Math.floor(@videoElement[0].currentTime);
        minutes = Math.floor(totalSeconds / 60)
        minutesZero = if minutes < 10 then "0" else ""
        totalSeconds %= 60
        secondsZero = if totalSeconds < 10 then "0" else ""
        text = "#{minutesZero + minutes.toString()}:#{secondsZero + totalSeconds.toString()}";

        @timeSpan.text(text)
        percentComplete = (@videoElement[0].currentTime / @duration * 100).toFixed(2)
        @progressBar.css('width': percentComplete + '%')
        return false;
      )
    .bind("ended",
      =>
        @playButton.removeClass('paused')
        @playing = false;
        return false;
      ).append(@track)
    @setPoster(@poster) if @poster?


    #init tight-container: @videoControls and <video> will go into tightContainer, which will be @container's child
    @tightContainer = $("<div>").addClass("tight-container")#.css({'background-color':'red'})
    .append(@videoElement).append(@videoControls).height(200)

    @container.addClass('video-container').append(@tightContainer)
    @setSource(@src) if @src?

  @saveStyle: (saveObject, fromThis, min) ->
    saveObject.width = fromThis.css('width')
    saveObject.height = fromThis.css('height')
    saveObject.position = fromThis.css('position')
    if !min
      saveObject.tlbr = {top:fromThis.css('top'), left:fromThis.css('left'), bottom:fromThis.css('bottom'), right:fromThis.css('right')}

  @is_touch_device: -> return 'ontouchstart' of window || 'onmsgesturechange' of window

  #min tells us to restore only width and height
  @restoreStyle: (toThis, fromSaveObject) ->
    toThis.css('width', fromSaveObject.width);
    toThis.css('height', fromSaveObject.height);
    toThis.css('position', fromSaveObject.position);

  #assumes that there are no width, height attributes, but maybe only width, height css props
  @stretch: (me) ->
    me.css {
      width:window.innerHeight,
      height:window.innerWidth,
      position:'absolute',
      top:0,left:0
    }
    me.addClass('stretched');

  enterFullScreenMode: () ->
    @fullScreenButton.toggleClass('un'); #un means unfullscreen
    if(!@isFullScreen)
      @isFullScreen = true;
      @beforeChangeStyle.tc = {}
      VideoPlayer.saveStyle(@beforeChangeStyle.tc, @tightContainer, true)

      #add stretched class and defaults width and height, then stretch video element
      VideoPlayer.stretch(@tightContainer);
      @onFullscreen() if @onFullscreen
    else
      @isFullScreen = false;
      VideoPlayer.restoreStyle(@tightContainer, @beforeChangeStyle.tc)
      @tightContainer.removeClass('stretched')
      @offFullscreen() if @offFullscreen
    return null

  play: () ->
    @playButton.toggleClass('paused')
    if(@playing)
      @playing = false;
      @videoElement[0].pause();
    else
      @playing = true;
      @videoElement[0].play();
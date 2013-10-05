(function() {
  var Gradient, Gradients,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.grad = Gradients = (function() {
    Gradients.getColor = function(arry) {
      return "rgba(" + arry.join(',') + ")";
    };

    Gradients.getRandomColor = function(reduceOpacity) {
      var array, num;

      reduceOpacity = reduceOpacity | 1;
      array = (function() {
        var _i, _results;

        _results = [];
        for (num = _i = 1; _i <= 3; num = ++_i) {
          _results.push(Math.floor(Math.random() * 256));
        }
        return _results;
      })();
      /*hexdigits = '0123456789abcdef';
      for (var v = 1; v <= 6; v++)
      {
          var rindex = Math.floor(Math.random() * hexdigits.length);
          array.push(hexdigits[rindex]);
      }
      */

      array.push(Math.random() / reduceOpacity);
      return getColor(array);
    };

    Gradients.prototype.st = function(t) {
      return $("#title").text(t);
    };

    function Gradients() {
      var c, g, numberOfColors, sCount, _i, _j, _k;

      this.randomSets = [];
      for (sCount = _i = 1; _i <= 10; sCount = ++_i) {
        numberOfColors = 3 + Math.floor(8 * Math.random());
        randomSets[sCount - 1] = [];
        for (c = _j = 1; 1 <= numberOfColors ? _j <= numberOfColors : _j >= numberOfColors; c = 1 <= numberOfColors ? ++_j : --_j) {
          randomSets[sCount - 1].push(getRandomColor(c === numberOfColors ? 4 : 1));
        }
      }
      this.gradients = [];
      for (g = _k = 1; _k <= 4; g = ++_k) {
        gradients.push(constructRadialGradient(randomSets[g - 1]));
      }
      this.timer = null;
      this.xy = null;
      this.vxy = [1, 1];
      this.lock = false;
      this.auto = false;
      this.speed = 20;
      this.stopsOffset = 0;
      $(document).ready(function() {
        var _this = this;

        return $("body").mousemove(function() {
          var x1, y1;

          if (!auto) {
            if (_this.timer !== null) {
              clearInterval(_this.timer);
            }
            _this.timer = null;
            x1 = e.originalEvent.offsetX;
            y1 = e.originalEvent.offsetY;
            _this.xy = [x1, y1];
            if (!auto) {
              return Do(x1, y1);
            }
          }
        }).mouseout(function() {
          var timer;

          if (false && auto) {
            console.log("mouseout");
            if (!timer) {
              return timer = setInterval(Do, speed);
            }
          }
        }).mousedown(function() {
          var auto, timer;

          if (!auto) {
            if (typeof timer !== "undefined" && timer !== null) {
              timer = setInterval(Do, speed);
            }
          } else if (timer !== null) {
            clearInterval(timer);
            timer = null;
          }
          return auto = !auto;
        });
      });
    }

    Gradients.prototype.constructRadialGradient = function(colorSet, offset) {
      var c, percentageStep, str, _i, _len;

      str = "radial-gradient(circle at %x%px %y%px, ";
      percentageStep = (60 / colorSet.length).toFixed(2);
      for (_i = 0, _len = colorSet.length; _i < _len; _i++) {
        c = colorSet[_i];
        offset = (percentageStep * (c + 1) + offset).toFixed(2);
        while (offset > 100) {
          offset -= 100;
        }
        str += colorSet[c] + " " + offset + "%";
        if (c !== colorSet.length - 1) {
          str += ", ";
        }
      }
      return str += ")";
    };

    Gradients.prototype.shiftArray = function(array, amt) {
      var k, _i, _len, _results;

      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        k = array[_i];
        _results.push(array[k] = array[k] + amt);
      }
      return _results;
    };

    Gradients.prototype.replaceXY = function(str, x, y) {
      return str.replace(/%x%/, x).replace(/%y%/, y);
    };

    Gradients.prototype.Do = function(x1, y1) {
      var lock, points, replacedGradients, x, xo1, yo1, _i, _len;

      stopsOffset++;
      lock = true;
      console.log("Do: " + x1 + ", " + y1);
      xo1 = null;
      yo1 = null;
      if (x1 === null || y1 === null) {
        x1 = this.xy[0];
        y1 = this.xy[1];
        console.log("Do: " + x1 + ", " + y1);
      }
      points = [[x1, y1], [$("body").width() - x1, $("body").height() - y1], [x1, $("body").height() - y1], [$("body").width() - x1, y1]];
      replacedGradients = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        x = points[_i];
        replacedGradients.push(replaceXY(gradients[x], points[x][0], points[x][1]));
      }
      $("body").css('background-image', replacedGradients.join(','));
      if (xo1 === null || yo1 === null) {
        this.xy[0] = this.xy[0] + this.vxy[0];
        this.xy[1] = this.xy[1] + this.vxy[1];
        if (this.xy[0] <= 0 || this.xy[0] >= $("body").width()) {
          this.vxy[0] = -this.vxy[0];
        }
        if (this.xy[1] <= 0 || this.xy[1] >= $("body").height()) {
          this.vxy[1] = -this.vxy[1];
        }
      }
      return lock = false;
    };

    return Gradients;

  })();

  Gradient = (function() {
    Gradient.prototype.location = [0, 0];

    Gradient.prototype.colors = [];

    Gradient.prototype.stops = [];

    function Gradient(location, colors, stops) {
      var k, percentageStep, _i, _len, _ref;

      this.location = location;
      this.colors = colors;
      this.stops = stops != null ? stops : null;
      this.getString = __bind(this.getString, this);
      if (stops == null) {
        percentageStep = (60 / colorSet.length).toFixed(2);
        _ref = this.colors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          k = _ref[_i];
          stops[k] = percentageStep * (k + 1);
        }
      }
    }

    Gradient.prototype.getString = function() {
      var c, str, _i, _len;

      str = "radial-gradient(circle at " + location[0] + "px " + location[1] + "px";
      for (_i = 0, _len = colors.length; _i < _len; _i++) {
        c = colors[_i];
        str += colors[c] + " " + stops[c];
        if (c !== colors.length - 1) {
          str += ", ";
        }
      }
      return str += ")";
    };

    return Gradient;

  })();

}).call(this);

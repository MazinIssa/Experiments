(function() {
  var Gradient, Gradients,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Gradients = Gradients = (function() {
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
      return Gradients.getColor(array);
    };

    Gradients.prototype.st = function(t) {
      return $("#title").text(t);
    };

    Gradients.getRandomSet = function() {
      var num, numberOfColors, ret;

      numberOfColors = 3 + Math.floor(8 * Math.random());
      return ret = (function() {
        var _i, _results;

        _results = [];
        for (num = _i = 1; _i <= numberOfColors; num = _i += 1) {
          _results.push(Gradients.getRandomColor(num === numberOfColors ? 4 : 1));
        }
        return _results;
      })();
    };

    Gradients.prototype.updateGradients = function() {
      var g, ggg, gggg, _i, _len, _ref;

      ggg = [];
      _ref = this.gradients;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        g = _ref[_i];
        g.applyVelocity();
        console.log("update grads: " + g.v);
        g.animateStops();
        ggg.push(g.getString());
      }
      gggg = ggg.join(',');
      return $("body").css('background-image', gggg);
    };

    function Gradients() {
      this.updateGradients = __bind(this.updateGradients, this);
      var sCount, _i,
        _this = this;

      this.randomSets = [];
      for (sCount = _i = 1; _i <= 10; sCount = ++_i) {
        this.randomSets[sCount - 1] = [];
      }
      this.gradients = [];
      this.updateTimer = null;
      $(function() {
        console.log("ok");
        return _this.updateTimer = setInterval(_this.updateGradients, 40);
      });
    }

    Gradients.shiftArray = function(array, amt) {
      var k, _i, _ref, _results;

      _results = [];
      for (k = _i = 0, _ref = array.length - 1; _i <= _ref; k = _i += 1) {
        array[k] = array[k] + amt;
        _results.push((function() {
          var _results1;

          _results1 = [];
          while (array[k] > 100) {
            _results1.push(array[k] -= 100);
          }
          return _results1;
        })());
      }
      return _results;
    };

    return Gradients;

  })();

  window.Gradient = Gradient = (function() {
    Gradient.prototype.stopsOffset = 0;

    function Gradient(colors, stops, location) {
      var i, percentageStep, _i, _j, _ref, _ref1;

      this.colors = colors != null ? colors : null;
      this.stops = stops != null ? stops : null;
      this.location = location != null ? location : [0, 0];
      if (this.colors == null) {
        this.colors = Gradients.getRandomSet();
      }
      if (this.stops == null) {
        this.stops = [];
        percentageStep = (60 / this.colors.length).toFixed(2);
        for (i = _i = 0, _ref = this.colors.length - 1; _i <= _ref; i = _i += 1) {
          this.stops[i] = percentageStep * (i + 1);
        }
      }
      for (i = _j = 0, _ref1 = this.colors.length - 1; _j <= _ref1; i = _j += 1) {
        this.colorStops.push({
          color: this.colors[i],
          stop: this.stops[i]
        });
      }
      this.v = [1, 1];
      this.assignRandomVelocity();
    }

    Gradient.prototype.applyVelocity = function() {
      this.location[0] = this.location[0] + this.v[0];
      this.location[1] = this.location[1] + this.v[1];
      if (this.location[0] >= $("body").width() || this.location[0] <= 0) {
        this.v[0] = -this.v[0];
      }
      if (this.location[1] >= $("body").height() || this.location[1] <= 0) {
        return this.v[1] = -this.v[1];
      }
    };

    Gradient.VValues = [-1, 0, 1];

    Gradient.prototype.assignRandomVelocity = function() {
      this.v[0] = Gradient.VValues[Math.floor(Math.random() * 3)];
      return this.v[1] = Gradient.VValues[Math.floor(Math.random() * 3)];
    };

    Gradient.prototype.animateStops = function() {
      return Gradients.shiftArray(this.stops, 1);
    };

    Gradient.prototype.getString = function() {
      var i, str, _i, _ref;

      str = "radial-gradient(circle at " + this.location[0] + "px " + this.location[1] + "px, ";
      for (i = _i = 0, _ref = this.colors.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        str += this.colors[i] + " " + this.stops[i] + "%";
        if (i !== this.colors.length - 1) {
          str += ", ";
        }
      }
      return str += ")";
    };

    return Gradient;

  })();

}).call(this);

window.grad = class Gradients
    @getColor: (arry) ->
        "rgba(" + arry.join(',') + ")";
         #return "#" + arry.join('');
    @getRandomColor: (reduceOpacity) ->
        reduceOpacity = reduceOpacity | 1
        array = (Math.floor(Math.random() * 256) for num in [1..3])
        ###hexdigits = '0123456789abcdef';
        for (var v = 1; v <= 6; v++)
        {
            var rindex = Math.floor(Math.random() * hexdigits.length);
            array.push(hexdigits[rindex]);
        }###

        array.push Math.random() / reduceOpacity;
        getColor(array);

    st: (t) -> $("#title").text t

    constructor: ->
        @randomSets = [];
        for sCount in [1..10]
            numberOfColors = 3 + Math.floor(8 * Math.random());
            randomSets[sCount - 1] = [];
            for c in [1..numberOfColors]
                randomSets[sCount - 1].push(getRandomColor(if c == numberOfColors then 4 else 1));
        @gradients = [];

        for g in [1..4]
            gradients.push constructRadialGradient(randomSets[g-1]);

        @timer = null
        @xy = null
        @vxy = [1, 1]
        @lock = false
        @auto = false
        @speed = 20;
        @stopsOffset = 0; #percentage offset 0-99 or no restriction

        $(document).ready(
            ->
                $("body")
                .mousemove(
                    =>
                        if !auto
                            if @timer != null then clearInterval(@timer);
                            @timer = null;
                            x1 = e.originalEvent.offsetX;
                            y1 = e.originalEvent.offsetY;
                            @xy = [x1, y1];
                            if !auto then Do(x1, y1);
                ).mouseout(
                    =>
                        if false && auto
                            console.log("mouseout");
                            if !timer then timer = setInterval(Do, speed);
                ).mousedown(
                    =>
                        if !auto then if timer? then timer = setInterval(Do, speed);
                        else if timer != null
                            clearInterval timer
                            timer = null
                        auto = !auto)
        )

    #color sets only (could use the colorSets, offsets overload but not much gain here
    constructRadialGradient: (colorSet, offset) ->
        str = "radial-gradient(circle at %x%px %y%px, "
        percentageStep = (60 / colorSet.length).toFixed(2)
        for c in colorSet
            offset = (percentageStep*(c+1) + offset).toFixed(2);
            while offset > 100
                offset -= 100; 
            str += colorSet[c] + " " + offset + "%"
            str += ", " if c != colorSet.length - 1
        str += ")"

    #color sets and offsets
    #constructRadialGradient: (colorSet, offsets) ->
    #    str = "radial-gradient(circle at %x%px %y%px, ";
    #    for c in colorSet.length
    #        str += colorSet[c] + " " + (percentageStep*(c+1)).toFixed(2) + "%";
    #        str += ", " if c != colorSet.length - 1
    #    str += ")";
    #    str;  
    
    shiftArray: (array, amt) ->
        for k in array
            array[k] = array[k] + amt;      

    replaceXY: (str, x, y) -> str.replace(/%x%/, x).replace(/%y%/, y);

    Do: (x1, y1) ->
        stopsOffset++;
        #if (lock) return;
        lock = true;
        console.log "Do: " + x1 + ", " + y1;
        xo1 = null
        yo1 = null
        if x1 == null || y1 == null
            x1 = @xy[0];
            y1 = @xy[1];
            console.log("Do: " + x1 + ", " + y1);

        points = [
                [x1, y1],
                [$("body").width() - x1, $("body").height() - y1],
                [x1, $("body").height() - y1],
                [$("body").width() - x1, y1],
        ];

        replacedGradients = [];
        for x in points
            replacedGradients.push(replaceXY(gradients[x], points[x][0], points[x][1]));

        #$("#radial").css('background-image', 'radial-gradient(circle at ' + e.originalEvent.offsetX + 'px ' + e.originalEvent.offsetY + 'px,#15f 10%,#00F 20%,#FFF 35%,#345 40%, #f41 50%, purple 60%)')
        $("body").css('background-image', replacedGradients.join(','));

        if xo1== null || yo1==null
            @xy[0] = @xy[0] + @vxy[0];
            @xy[1] = @xy[1] + @vxy[1];
            if (@xy[0] <= 0 || @xy[0] >= $("body").width()) then @vxy[0] = -@vxy[0];
            if (@xy[1] <= 0 || @xy[1] >= $("body").height()) then @vxy[1] = -@vxy[1];

        lock = false;

#data encapsulation without animation functionality for now
class Gradient
    location: [0, 0]
    colors: []
    stops: []

    constructor: (@location, @colors, @stops = null) ->
        if !stops?
            percentageStep = (60 / colorSet.length).toFixed(2)
            for k in @colors
                stops[k] = percentageStep * (k+1)

    getString: =>
        str="radial-gradient(circle at #{location[0]}px #{location[1]}px"
                
        for c in colors
            str += colors[c] + " " + stops[c]
            str += ", " if c != colors.length - 1

        str += ")"

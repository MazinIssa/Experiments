window.Gradients = class Gradients
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
        Gradients.getColor(array);

    st: (t) -> $("#title").text t

    @getRandomSet: ->
        numberOfColors = 3 + Math.floor(8 * Math.random());
        ret = (Gradients.getRandomColor(if num == numberOfColors then 4 else 1) for num in [1..numberOfColors] by 1);

    updateGradients: =>
        ggg = [];
        for g in @gradients
            g.applyVelocity();
            console.log "update grads: " + g.v
            g.animateStops();
            ggg.push(g.getString())

        gggg = ggg.join(',');

        $("body").css('background-image', gggg);

    constructor: ->
        #random set of colors
        @randomSets = [];
        for sCount in [1..10]
            @randomSets[sCount - 1] = [];
            
        @gradients = [];

        @updateTimer=null

        #setup a timer that updates the gradients
        $(=>
            console.log "ok"
            @updateTimer=setInterval(@updateGradients, 40));

    @shiftArray: (array, amt) ->
        for k in [0..array.length-1] by 1
            array[k] = array[k] + amt;
            while array[k] > 100
                array[k] -= 100

window.Gradient = class Gradient
    stopsOffset: 0 #percentage offset 0-99 or no restriction
    constructor: (@colors = null, @stops = null, @location = [0,0]) ->
        if !@colors? then @colors = Gradients.getRandomSet();
        if !@stops?
            @stops = []
            percentageStep = (60 / @colors.length).toFixed(2)
            for i in [0..@colors.length-1] by 1
             #stops count == color count
                @stops[i] = percentageStep * (i+1)
        @v = [1,1]
        @assignRandomVelocity();

    applyVelocity: ->
        @location[0] = @location[0] + @v[0]
        @location[1] = @location[1] + @v[1]
        if @location[0] >= $("body").width() or @location[0] <= 0 then @v[0] = -@v[0]
        if @location[1] >= $("body").height() or @location[1] <= 0 then @v[1] = -@v[1]

    @VValues: [-1,0,1];
    assignRandomVelocity: ->
        @v[0] = Gradient.VValues[Math.floor(Math.random() * 3)];
        @v[1] = Gradient.VValues[Math.floor(Math.random() * 3)];

    animateStops: -> Gradients.shiftArray(@stops, 1)

    getString: ->
        str="radial-gradient(circle at #{@location[0]}px #{@location[1]}px, "
        for i in [0..@colors.length-1]
            str += @colors[i] + " " + @stops[i] + "%"
            str += ", " if i != @colors.length - 1
        str += ")"
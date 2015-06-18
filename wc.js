var keywords = ["Shanelle Kulas", "Alfredo Boehm", "Nathan Lowe III", "London Prosacco", "Miss Cecelia Rodriguez", "Ronny Anderson", "Devan Jaskolski", "Devan Jaskolski", "Freddy Kreiger", "Aric Heathcote", "Bradley Sanford Sr."];
//var randomRotate = d3.scale.linear().domain([0, 1]).range([-20, 20]);

var h = window.innerHeight-100,
    w = window.innerWidth,
    midY = h / 2,
    midX = w / 2;

//var fill = d3.scale.category20();
var drawCloud = function (jsonFileNo) {
    d3.json("data/data" + jsonFileNo+".json", function (data) {
        var min = d3.min(data, function (d) { return d.frequency; });
        var max = d3.max(data, function (d) { return d.frequency; });

        var dataLength = data.length;
        var rangeMax = w / (dataLength);
        
        var wordScale = d3.scale.linear().domain([min, max]).range([6, rangeMax < 14 ? 14: rangeMax]).nice().clamp(true);

        var opacityScale = d3.scale.linear().domain([min, max]).range([0, 1]);
       

        // Draw the word cloud
        var draw = function (words) {
            //zoom function
           
            var zoom = d3.behavior.zoom()
                        .scaleExtent([1, 10])
                        .on("zoom", function () {
                            d3.select("#wordCloudG")
                            .attr("transform", "translate(" + [midX, midY] + ")scale(" + d3.event.scale + ")");
                        });
         

            var svg = d3.select(".col-lg-12").append("svg")
                        .attr("id", "wc")
                        .attr("width", w)
                        .attr("height", h)
                        .append("g")
                        .attr("id", "wordCloudG")
                        .attr("transform", "translate(" + [midX, midY] + ")")
                        .call(zoom)
                        .append("g")
                        .attr("id", "#textContainer");
                        

            var cloud = svg.selectAll("#textContainer text")
                        .data(words, function (d) { return d.text; });

            var drag = d3.behavior.drag()
                        .on('dragstart', function () { 
                            d3.select(this)
                                .style('stroke-width', 1)
                                .style('stroke', 'red');
                        })
                        .on('drag', function () {
                            d3.select(this)
                                .attr('transform', "translate(" + [d3.event.x, d3.event.y] + ")");
                        })
                        .on('dragend', function () {
                            d3.select(this)
                            .style('stroke', 'none');
                        });

            //Entering words
            cloud.enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", function (d) { return ((keywords.indexOf(d.text) > -1) ? "#ff0000" : "black"); })
                .attr("text-anchor", "middle")
                .style('font-size', function (d) {
                    return  (wordScale(d.frequency) + 'px');
                })
                .style("opacity", function (d) { return opacityScale(d.frequency); })
                .text(function (d) { return d.text; })
                .call(drag)
                .on('mouseover', function (d,i) {
                    tempColor = this.style.fill;
                    //tooltip.transition().style('opacity', .9);
                    var selectThis = d3.select(this);

                    selectThis
                        .append('title')
                        .html(" <span>" + d.frequency + "</span> instances <span><br />" + d.frequency + " </span>documents");

                    selectThis
                        .attr('cursor', 'pointer')
                        .attr('text-decoration', 'underline');
                        
                })
                .on('mouseout', function (d) {
                    d3.select(this)
                        .style('fill', tempColor)
                        .attr('text-decoration', 'none');
                })
                .on('click', function (d) {
                    d3.select(this)
                        .attr("stroke", "red");
                })
                .on('dblclick', function (d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style('fill', tempColor);
                    window.open("https://www.google.com.au/search?q=" + d.text);
                });

                //Entering and existing words
                cloud.transition()
                    .duration(600)
                    .style("font-size", function (d) { return  wordScale(d.frequency) + "px"; })
                    .attr("transform", function (d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("fill-opacity", 1);

                //Exiting words
                cloud.exit()
                    .transition()
                    .duration(100)
                    .style('fill-opacity', 1e-6)
                    .attr('font-size', 1)
                    .remove();
        };

        var wordCloud = d3.layout.cloud().size([w, h])
            .timeInterval(10)
            .spiral("archimedean")
            //.spiral('rectangular')
            .words(data)
            .padding(1)
            
            //.rotate(function (d) { return d.text.length > 12 ? 0 : 90; })
            .rotate(0)
            //.font("Impact")
            .text(function (d) { return d.text;})
            .fontSize(function (d) { return wordScale(d.frequency); })
            
            .on("end", draw)
            .start();
    });
};

drawCloud(100);

var updateCloud = function () {
    var wordsOptionEl = document.getElementById("wordsOptions");
    var numOfWords = wordsOptionEl.options[wordsOptionEl.selectedIndex].value;
    if (isNaN(numOfWords)) {
        var numOfWords = 100;
    } 
    var svg = d3.selectAll("#wc");
    svg.remove();

    drawCloud(numOfWords);
    $("body").append("<div class='text-size'></div>");
}

var clearWC = function () {
    var svg = d3.selectAll("#wc");
    svg.remove();
    $('.text-size').remove();
};
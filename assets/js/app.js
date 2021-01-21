// D3 plot

var width = parseInt(d3.select("#scatter").style("width"));

var height = width - width / 3.5;

var margin = 5;


var label_area = 110;

var t_pad_bottom = 40;
var t_pad_left = 40;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");


var set_circle_radius;
function update_dot() {
  if (width <= 530) {
    set_circle_radius = 5;
  }
  else {
    set_circle_radius = 10;
  }
}
update_dot();



svg.append("g").attr("class", "xText");

var xText = d3.select(".xText");

function x_text_refresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - label_area) / 2 + label_area) +
      ", " +
      (height - margin - t_pad_bottom) +
      ")"
  );
}
x_text_refresh();


// 1. Poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// 2. Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// 3. Income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");




var leftTextX = margin + t_pad_left;
var leftTextY = (height + label_area) / 2 - label_area;


svg.append("g").attr("class", "yText");


var yText = d3.select(".yText");


function y_text_refresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
y_text_refresh();


// 1. Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// 2. Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// 3. Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");



// Import our CSV 
d3.csv("assets/data/data.csv").then(function(data) {
  visualize(data);
});


function visualize(data) {

  var curX = "poverty";
  var curY = "healthcare";


  var xMin;
  var xMax;
  var yMin;
  var yMax;

  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // x key
      var theX;
      // Get the state name.
      var theState = "<div>" + d.state + "</div>";
      // Snatch the y value's key and value.
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
          if (curX === "poverty") {
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {

        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }

      return theState + theX + theY;
    });

  svg.call(toolTip);



 
  function xMinMax() {
  
    xMin = d3.min(data, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    xMax = d3.max(data, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

 
  function yMinMax() {
  
    yMin = d3.min(data, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(data, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }


  function labelChange(axis, clickedText) {
      d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    clickedText.classed("inactive", false).classed("active", true);
  }


  xMinMax();
  yMinMax();


  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + label_area, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - label_area, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);


  function tick_count() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tick_count();


  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - label_area) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + label_area) + ", 0)");


  var theCircles = svg.selectAll("g theCircles").data(data).enter();


  theCircles
    .append("circle")
     .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", set_circle_radius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
       .on("mouseover", function(d) {
   
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

  theCircles
    .append("text")
     .text(function(d) {
      return d.abbr;
    })
       .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {

      return yScale(d[curY]) + set_circle_radius / 2.5;
    })
    .attr("font-size", set_circle_radius)
    .attr("class", "stateText")
  
    .on("mouseover", function(d) {
      toolTip.show(d);
         d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
        toolTip.hide(d);
        d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

/////////

 
  d3.selectAll(".aText").on("click", function() {

    var self = d3.select(this);

    if (self.classed("inactive")) {
        var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      if (axis === "x") {
         curX = name;

        xMinMax();

        xScale.domain([xMin, xMax]);
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {

        curY = name;

        yMinMax();

        yScale.domain([yMin, yMax]);


        svg.select(".yAxis").transition().duration(300).call(yAxis);

        d3.selectAll("circle").each(function() {

          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {

          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + set_circle_radius / 3;
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
    }
  });

 }
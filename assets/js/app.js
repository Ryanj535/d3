// svg dimensions
var svgWidth = 800;
var svgHeight = 660;

var chartMargin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 50
};

// Dimensions of chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom

// Building Chart
var svg = d3.select('#scatter')
  .append('svg')
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv('./assets/data/data.csv').then(function(healthData) {
  healthData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty
    });
    var xLinearScale = d3.scaleLinear()
     .domain([d3.min(healthData, d => d.poverty) - 1.25, d3.max(healthData, d => d.poverty)])
     .range([0, chartWidth]);

   var yLinearScale = d3.scaleLinear()
     .domain([d3.min(healthData, d => d.healthcare) - 2, d3.max(healthData, d => d.healthcare) + 1])
     .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "blue")
      .attr("opacity", ".5");

     var textGroup = chartGroup.selectAll("text")
       .data(healthData)
       .enter()
       .append("text")
       .text(d => d.abbr)
       .attr("dx", d => xLinearScale(d.poverty))
       .attr("dy", d => yLinearScale(d.healthcare) +3)
       .attr("font-family", "sans-serif")
       .attr("font-size", "8px")
       .attr("fill", "white")
       .attr("text-anchor", "middle");

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br> In Poverty: ${d.poverty}%<br> Lacks Healthcare: ${d.healthcare}%`);
      });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

      textGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 5)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight +40})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

  });

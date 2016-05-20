//----------
//STORY SECTION
//----------

var story1 = 
{
  "title": "Story 2",
  "text": "Lorem Ipsum Doler Sit Amet",
  "geo_x": 500,
  "geo_y": 310,
  "next": {
    "title": "Story 2 Page 2",
    "text": "Lorem Ipsum Doler Sit Amet 2",
    "geo_x": 550,
    "geo_y": 350,
    "next": {
      "title": "Story 2 Page 3",
      "text": "Lorem Ipsum Doler Sit Amet 3",
      "geo_x": 650,
      "geo_y": 650
    }
  }
};

var story2 = 
{
  "title": "Story 1",
  "text": "Lorem Ipsum Doler Sit Amet",
  "geo_x": 530,
  "geo_y": 570,
  "next": {
    "title": "Story 1 Page 2",
    "text": "Lorem Ipsum Doler Sit Amet 2",
    "geo_x": 750,
    "geo_y": 550,
    "next": {
      "title": "Story1 Page 3",
      "text": "Lorem Ipsum Doler Sit Amet 3",
      "geo_x": 850,
      "geo_y": 650
    }
  }
};

var stories = [story1, story2];

//----------
//INITIAL SET UP
//----------

var width = 640;
var height = 480;
var nodeRadius = "1.1%";
var containerName = "#story-container";
    
var layoutRoot = d3.select(containerName)
  .attr("width", width).attr("height", height).attr("viewBox", "200 200 1480 1160")
  .append("svg:g").attr("class", "container");

//----------
//HELPER FUNCTION SECTION
//----------

var zoomToNode = function(focusNode) {
  var cornerX = focusNode.x - 640;
  var cornerY = focusNode.y - 480;
  d3.select(containerName).transition().duration(750).attr("viewBox", cornerX + " " + cornerY + " 1280 960");
}

var clickNode = function(clickedNode) {
  if (!clickedNode.exposed_next && clickedNode.next) {
    clickedNode.exposed_next = clickedNode.next;
    updateMap(stories);
  }

  d3.select("#node_title").text(clickedNode.title);
  d3.select("#node_body").text(clickedNode.text);

  zoomToNode(clickedNode);
}

var visibleNodes = function(storyLine) {
  var treeLayout = d3.layout.tree()
    .sort(null)
    .size([width, height])
    .children(function(d)
    {
      return d.exposed_next ? [d.exposed_next] : null;
    });
  
  var visible = treeLayout.nodes(storyLine);
  visible.forEach(function(node, index, array) {node.x = node.geo_x; node.y = node.geo_y});

  return visible;
}

var linksForNodes = function(nodes) {
  var treeLayout = d3.layout.tree()
    .sort(null)
    .size([width, height])
    .children(function(d)
    {
      return d.next ? [d.next] : null;
    });

  return treeLayout.links(nodes);
}

var updateMap = function(storyLines) {
  var allVisibleNodes = storyLines.map(visibleNodes);
  var allVisibleLinks = allVisibleNodes.map(linksForNodes);

  allVisibleNodes = allVisibleNodes.reduce(function(previous, current) { return previous.concat(current);}, []);
  allVisibleLinks = allVisibleLinks.reduce(function(previous, current) { return previous.concat(current);}, []);

  var drawnLinks = layoutRoot.selectAll("line.link").data(allVisibleLinks);
  drawnLinks.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
  drawnLinks.enter()
    .append("svg:line")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
  drawnLinks.exit().remove();

  layoutRoot.selectAll("circle.node-dot").remove();
  var drawnNodes = layoutRoot.selectAll("circle.node-dot").data(allVisibleNodes);
  drawnNodes.enter()
    .append("svg:circle")
    .attr("class", "node-dot")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return nodeRadius; })
    .on("click", clickNode);
  drawnNodes.exit().remove;
};

updateMap(stories);

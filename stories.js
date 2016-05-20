//----------
//STORY SECTION
//----------

var story1 = 
{
  "title": "Foo",
  "text": "Lorem Ipsum Doler Sit Amet",
  "geo_x": 10,
  "geo_y": 10,
  "next": {
    "title": "Foo 2",
    "text": "Lorem Ipsum Doler Sit Amet 2",
    "geo_x": 50,
    "geo_y": 50,
    "next": {
      "title": "Foo 3",
      "text": "Lorem Ipsum Doler Sit Amet 3",
      "geo_x": 150,
      "geo_y": 150
    }
  }
};

var story2 = 
{
  "title": "Foo",
  "text": "Lorem Ipsum Doler Sit Amet",
  "geo_x": 210,
  "geo_y": 10,
  "next": {
    "title": "Foo 2",
    "text": "Lorem Ipsum Doler Sit Amet 2",
    "geo_x": 250,
    "geo_y": 50,
    "next": {
      "title": "Foo 3",
      "text": "Lorem Ipsum Doler Sit Amet 3",
      "geo_x": 350,
      "geo_y": 150
    }
  }
};

var stories = [story1, story2];

//----------
//INITIAL SET UP
//----------

var width = 640;
var height = 480;
var nodeRadius = 5;
var containerName = "#story-container";
    
var layoutRoot = d3.select(containerName)
  .append("svg:svg").attr("width", width).attr("height", height)
  .append("svg:g")
  .attr("class", "container");

//----------
//HELPER FUNCTION SECTION
//----------

var clickNode = function(clickedNode) {
  if (!clickedNode.exposed_next && clickedNode.next) {
    clickedNode.exposed_next = clickedNode.next;
    updateMap(stories);
  }

  d3.select("#node_title").text(clickedNode.title);
  d3.select("#node_body").text(clickedNode.text);
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

  var link = d3.svg.diagonal()
        .projection(function(d)
        {
            return [d.x, d.y];
        });

  var drawnLinks = layoutRoot.selectAll("path.link").data(allVisibleLinks);
  drawnLinks.attr("d", link);
  drawnLinks.enter()
    .append("svg:path")
    .attr("class", "link")
    .attr("d", link);
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

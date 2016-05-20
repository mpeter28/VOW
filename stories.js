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
  "geo_x": 200,
  "geo_y": 80,
  "next": {
    "title": "Foo 2",
    "text": "Lorem Ipsum Doler Sit Amet 2",
    "geo_x": 70,
    "geo_y": 90,
    "next": {
      "title": "Foo 3",
      "text": "Lorem Ipsum Doler Sit Amet 3",
      "geo_x": 40,
      "geo_y": 10
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

var visibleNodes = function(storyLine) {
  var treeLayout = d3.layout.tree()
    .sort(null)
    .size([width, height])
    .children(function(d)
    {
      return d.next ? [d.next] : null;
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

  layoutRoot.selectAll("path.link")
    .data(allVisibleLinks)
    .enter()
    .append("svg:path")
    .attr("class", "link")
    .attr("d", link);

  layoutRoot.selectAll("g.node")
    .data(allVisibleNodes)
    .enter()
    .append("svg:g")
    .attr("class", "node")
    .attr("transform", function(d)
    {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .append("svg:circle")
    .attr("class", "node-dot")
    .attr("r", nodeRadius);
};

updateMap([story1, story2]);

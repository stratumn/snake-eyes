'use strict';

angular
  .module('snakeEyesApp')
  .directive('mapExplorer', MapExplorer);

//MapExplorer.$inject = ['$q', '$http', '$document'];

function MapExplorer() {

  //function parseStratumn(stratumnJSON) {
  //  var edges = [];
  //  var nodes = [];
  //
  //  for (var i = 0; i < stratumnJSON.length; i++) {
  //    var node = {};
  //    var segment = stratumnJSON[i];
  //    node['id'] = segment.meta.linkHash;
  //    node['title'] = segment.meta.linkHash;
  //    node['attributes'] = segment.link.meta;
  //
  //    var parent = segment.link.meta.prevLinkHash;
  //    var edge = {};
  //    edge['id'] = segment.meta.linkHash;
  //
  //    if (parent) {
  //      edge['from'] = parent;
  //    }
  //
  //    edge['to'] = segment.meta.linkHash;
  //    edge['attributes'] = segment.link.meta;
  //    edge['label'] = segment.link.meta.action;
  //    edge['arrows'] = 'to';
  //
  //    edges.push(edge);
  //
  //    nodes.push(node);
  //  }
  //
  //  return {nodes:nodes, edges:edges};
  //}

  //function get(url) {
  //  var deferred = $q.defer();
  //
  //  $http.get(url)
  //    .success(function(res) {
  //      if (res.meta && res.meta.errorMessage) {
  //        var msg = res.meta.errorMessage;
  //        console.log(msg);
  //        deferred.reject(msg);
  //      }
  //      else {
  //        deferred.resolve(res);
  //      }
  //    })
  //    .error(function(err) {
  //      deferred.reject(err);
  //    });
  //  return deferred.promise;
  //}

  //get(scope.mapUrl)
  //  .then(function(json) {
  //    var parsedData = parseStratumn(json);
  //    var data = {
  //      nodes: parsedData.nodes,
  //      edges: parsedData.edges
  //    };
  //    var network = new vis.Network(element[0], data, {
  //      height: '800px',
  //      layout: {
  //        hierarchical: {
  //          enabled: true,
  //          direction: 'LR'
  //        }
  //      }
  //    });
  //    network.on('selectNode', function(event) {
  //      var node = event.nodes[0];
  //
  //      get('http://snake-eyes.lvh.me:3001/links/' + node)
  //        .then(function(res){
  //          console.log(res.link.state);
  //        })
  //
  //    });
  //  });

  function parse(chainMap) {
    var root;
    var segmentsByHash = {};

    chainMap.forEach(function(segment) {
      if (!segment.link.meta.prevLinkHash) {
        root = segment;
      }
      segmentsByHash[segment.meta.linkHash] = segment;
      segment.children = []
    });

    if (!root) {
      root = chainMap[0];
    }

    chainMap.forEach(function(segment) {
      if (segment.link.meta.prevLinkHash) {
        var parent = segmentsByHash[segment.link.meta.prevLinkHash];
        if (!parent) {
          throw 'Missing parent with linkHash ' + segment.meta.linkHash;
        }

        parent.children.push(segment);
      }
    });

    return root;
  }

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  return {
    restrict: 'E',
    scope: {
      mapUrl: '=',
      refresh: '='
    },
    template: '<svg></svg>',
    link: function(scope, element, attrs) {

      scope.$watchGroup(['mapUrl', 'refresh'], function(newValues) {
        var mapUrl = newValues[0];

        if (!mapUrl) {
          return;
        }
        element.find('svg').empty();

        var margin = {top: 20, right: 120, bottom: 20, left: 120},
          width = 960 - margin.right - margin.left,
          height = 800 - margin.top - margin.bottom;

        var i = 0,
          duration = 750,
          root;

        var tree = d3.layout.tree().size([width, height]);

        var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select(element.find("svg")[0])
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json(mapUrl, function(error, json) {
          if (error) throw error;

          root = parse(json);

          root.x0 = height / 2;
          root.y0 = 0;

          update(root);
        });

        d3.select(self.frameElement).style("height", height + "px");

        function update(source) {

          // Compute the new tree layout.
          var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

          // Normalize for fixed-depth.
          nodes.forEach(function(d) { d.y = d.depth * 180; });

          // Update the nodes…
          var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", click);

          nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", "#fff");

          nodeEnter.append("text")
            .attr("x", 0)
            .attr("dy", "-1em")
            .attr('text-anchor', 'middle')
            .text(function(d) { return d.meta.linkHash.slice(0, 3) + '...' + d.meta.linkHash.slice(61); })
            .style("fill-opacity", 1e-6);

          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

          nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", "#fff");

          nodeUpdate.select("text")
            .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

          nodeExit.select("circle")
            .attr("r", 1e-6);

          nodeExit.select("text")
            .style("fill-opacity", 1e-6);

          // Update the links…
          var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

          link.enter().insert("text")
            .attr("x", 40)
            .attr("dy", "-0.5em")
            .append("textPath")
            .attr("class", "textpath")
            .attr("xlink:href",  function(d) { return "#" + d.target.id; } )
            .text(function(d) { return d.target.link.meta.action + '(' + d.target.link.meta.arguments.join(', ') + ')'; });

          // Enter any new links at the parent's previous position.
          link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("id", function(d) { return d.target.id; })
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            });
          // Transition links to their new position.
          link.transition()
            .duration(duration)
            .attr("d", diagonal);

          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });
        }

        // Toggle children on click.
        function click(d) {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d);
        }
      });
    }
  };
}

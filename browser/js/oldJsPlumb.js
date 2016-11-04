jsPlumb.ready(function() {
    var i = 0;

    jsPlumb.Defaults.Container = $("#container");
    jsPlumb.Defaults.PaintStyle = { strokeStyle:"#000000", lineWidth:2};
    jsPlumb.Defaults.EndpointStyle = { radius:3, fillStyle:"#FF0000" };
    jsPlumb.importDefaults({
        Connector :  "Flowchart",
        hoverPaintStyle: { strokeStyle: "blue" },
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                width: 10,
                length: 10,
                visible: true
            }]
        ]
    });


  // // Deletes all jsplumb connections

  //   jsPlumb.detachEveryConnection();

  // // Repaints all jsplumb connections
  //   $('#repaintall').click(function(e) {
  //   jsPlumb.repaintEverything();
  //   });


});

var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
    for (var i = 0; i < sourceAnchors.length; i++) {
        var sourceUUID = toId + sourceAnchors[i];
        jsPlumb.addEndpoint(toId, sourceEndpoint, {
            anchor: sourceAnchors[i], uuid: sourceUUID
        });
    }
    for (var j = 0; j < targetAnchors.length; j++) {
        var targetUUID = toId + targetAnchors[j];
        jsPlumb.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
    }
};
// Adds the project div to the container at a specific location
function addEq(id, tag) {
    var box = $('<div>').attr('id', id).addClass('jsplumb-box');
    if (tag === '#vesselSVG'){
        $(box).addClass('vessel-box');
    }

    else if (tag === '#pumpSVG'){
        $(box).addClass('pump-box');
    }
    var item = $(tag).clone();
    item.removeAttr('display');
    item.appendTo(box);



    $('#canvas').append(box);

    // Make the project div draggable inside the container
    jsPlumb.draggable(box, {
    containment: 'parent'
    });
    var connectBox = $('<div>').attr('id', id).addClass('connect-box')

    // A title for the task
    var title = $('<div>').addClass('title').text(id);
    connectBox.append(title);

    $(box).append(connectBox);

    jsPlumb.makeTarget(connectBox, {
    //anchor: 'Continuous'
    anchor:["Continuous", { faces:["left", "right"] } ]
    });

    // Makes the task div a possible source (i.e. connection can be dragged from)
    jsPlumb.makeSource(connectBox, {
    //anchor: 'Continuous'
    anchor:["Continuous", { faces:["left", "right"] } ]
    });

}

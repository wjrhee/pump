window.app = angular.module('app', []);

var connectorPaintStyle = {
    strokeWidth: 2,
    stroke: "#61B7CF",
    joinstyle: "round",
    outlineStroke: "white",
    outlineWidth: 2
},
connectorHoverStyle = {
    strokeWidth: 3,
    stroke: "#216477",
    outlineWidth: 5,
    outlineStroke: "white"
},
endpointHoverStyle = {
    fill: "#216477",
    stroke: "#216477"
},
sourceEndpoint = {
    endpoint: "Dot",
    paintStyle: {
        stroke: "#7AB02C",
        fill: "transparent",
        radius: 7,
        strokeWidth: 1
    },
    isSource: true,
    connector: [ "Flowchart", { stub: [40, 60], gap: 5, cornerRadius: 0, alwaysRespectStubs: true } ],
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    dragOptions: {},
    overlays: [
        [ "Label", {
            location: [0.5, 1.5],
            label: "Drag",
            cssClass: "endpointSourceLabel",
            visible:false
        } ]
    ]
},
targetEndpoint = {
    endpoint: "Dot",
    paintStyle: { fill: "#7AB02C", radius: 7 },
    hoverPaintStyle: endpointHoverStyle,
    maxConnections: -1,
    dropOptions: { hoverClass: "hover", activeClass: "active" },
    isTarget: true,
    overlays: [
        [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
    ]
}
var instance;


jsPlumb.ready(function () {

    instance = window.jsp = jsPlumb.getInstance({

        DragOptions: { cursor: 'pointer', zIndex: 2000 },

        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW",
                events:{
                    click:function() { alert("you clicked on the arrow overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel",
                events:{
                    tap:function() { alert("hey"); }
                }
            }]
        ],
        Container: "canvas"
    });

    // var selectedConn = {
    //     connector: "StateMachine",
    //     paintStyle: { stroke: "red", strokeWidth: 4 },
    //     hoverPaintStyle: { stroke: "blue" },
    //     overlays: [
    //         "Arrow"
    //     ]
    // };
    // instance.registerConnectionType("basic", selectedConn);



        init = function (connection) {
            connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
        };



    instance.batch(function () {

        instance.bind("click", function (conn, originalEvent) {
            // delete connection?
        });

        instance.bind("connectionDrag", function (connection) {
            console.log('dragging: ', connection);

        });

        instance.bind("connectionDragStop", function (connection) {
            console.log('dragged and stopped: ',connection)
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection moved: ", params);
        });
    });

});

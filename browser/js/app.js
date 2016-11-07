window.app = angular.module('app', ['ui.router']);


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
        connection.getOverlay("label").setLabel(connection.sourceId + "-" + connection.targetId);
    };


    instance.batch(function () {

        instance.bind("click", function (conn, originalEvent) {
            // delete connection?
        });

        instance.bind("connectionDrag", function (connection) {
            console.log('dragging: ', connection);

        });

        instance.bind("connection", function (connection, e) {

            if(system.equipment[connection.sourceId] && system.equipment[connection.targetId]){
                var src = system.equipment[connection.sourceId];
                var tgt = system.equipment[connection.targetId];

                // initialize new pipe and store it into the system

                var pipeName = 'pipe-' + connection.sourceId + '-' + connection.targetId;
                var newPipe = new Pipe(pipeName);
                newPipe.source = connection.sourceId;
                newPipe.target = connection.targetId;
                system.pipes[pipeName] = newPipe;
                // scope.equipment.push(newPipe);

                src.connectionTo.push(newPipe);
                tgt.connectionFrom.push(newPipe);

                console.log(system);
            }
            else{
                console.log('pipe not created.  no connection');
            }
        })

        instance.bind("connectionDetached", function(connection,e){
            var pipeName = 'pipe-' + connection.sourceId + '-' + connection.targetId;

            if(system.pipes[pipeName]){
                delete system.pipes[pipeName]
            }

            if(system.equipment[connection.sourceId]){
                for(var i = 0; i < system.equipment[connection.sourceId].connectionTo.length; i++){
                    if(system.equipment[connection.sourceId].connectionTo[i].name === pipeName){
                        system.equipment[connection.sourceId].connectionTo.splice(i, 1);
                    }
                }
            }

            if(system.equipment[connection.targetId]){
                for(var i = 0; i < system.equipment[connection.targetId].connectionFrom.length; i++){
                    if(system.equipment[connection.targetId].connectionFrom[i].name === pipeName){
                        system.equipment[connection.targetId].connectionFrom.splice(i, 1);
                    }
                }
            }

            console.log(system);

        })

        instance.bind("connectionMoved", function (params) {
            console.log("connection moved: ", params);
        });
    });

});

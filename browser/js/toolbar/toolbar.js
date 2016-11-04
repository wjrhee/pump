// TODO: move all calculation code to new file


app.directive('toolbar', function($rootScope){
    return {
        restrict: 'E',
        templateUrl: '/js/toolbar/toolbar.html',
        link: function(scope, element, attrs){
            var connectionPoints = ['TopCenter', 'RightMiddle', 'BottomCenter', 'LeftMiddle'];

            scope.addNewEq = function(){
                var id = $('#eqNameInput').val();
                var newNode = $('<div>').attr('id', id).addClass('window jtk-node');
                $('#canvas').append(newNode);
                newNode.append(`<strong>${id}</strong>`)
                instance.draggable(newNode, {
                    containment: 'parent'
                })
                instance.makeTarget(newNode, {
                    anchor: ["Continuous", {
                        faces: ["left", "right"]
                    }]
                })
                connectionPoints.forEach(connPt => {
                    instance.addEndpoint(newNode, sourceEndpoint, {
                        anchor: connPt, uuid: connPt + id
                    })
                })
            }
        }

    }
})

// app.directive('toolbar', function($rootScope){
//   return {
//     restrict: 'E',
//     templateUrl: 'js/toolbar/toolbar.html',
//     link: function(scope, element, attrs){

//     scope.items = ['Vessel', 'Pump', 'Fitting'];
//     scope.modes = ['edit', 'create'];
//     scope.mode = 'create';
//     scope.equipment = [];
//     scope.sch = ['5', '10', '20', '30', '40', 'STD', '80', 'XS'];
//     scope.nps = Object.keys(pipeTable);


//     jsPlumb.bind('connectionDragStop', function(conn){


//         if(system.equipment[conn.source.id] && system.equipment[conn.target.id]){
//             var src = system.equipment[conn.source.id];
//             var tgt = system.equipment[conn.target.id];

//             // initialize new pipe and store it into the system

//             var pipeName = 'pipe-' + conn.source.id + '-' + conn.target.id;
//             var newPipe = new Pipe(pipeName);
//             newPipe.start = conn.source.id;
//             newPipe.end = conn.target.id;
//             system.pipes.push(newPipe);
//             scope.equipment.push(newPipe);


//             src.connectionTo[conn.target.id] = conn.target;
//             src.connectionToPipe[pipeName] = newPipe;

//             tgt.connectionFrom[conn.source.id] = conn.source;
//             tgt.connectionFromPipe[pipeName] = newPipe;

//             console.log(system.equipment);

//         }
//         else{
//             console.log('pipe not created.  no connection');
//         }
//     })

// // take type of equipment to be created as string and create svg element and new instance of equipment
//       scope.create = function(t){

//         switch (t){
//           case 'Vessel':
//             addEq(scope.vessel.name, '#vesselSVG');

//             var vessel = new Vessel(scope.vessel);
//             system.equipment[scope.vessel.name] = vessel;
//             scope.equipment.push(vessel);

//             if (scope.sf) system.sf = scope.sf;

//             break;
//           case 'Pump':
//             if(!system.pump){
//                 addEq(scope.pump.name, '#pumpSVG');

//                 var pump = new Pump(scope.pump.flow, scope.pump.name);
//                 system.equipment[scope.pump.name] = pump;
//                 scope.equipment.push(pump);
//                 if(scope.sf) system.sf = scope.sf;
//                 system.pump = pump;
//             }
//             else{
//                 console.log('already have a pump');
//             }

//             break;
//             // create case for fittings

//           default:
//             break;
//         }
//       }

//     var setHp = function(_profile, _vessel){
//         _profile.hp = _vessel.P.op / (_vessel.sg * 9.8);
//         return _profile.hp;

//     }
//     var setHs = function(_profile, _vessel){
//         _profile.hs = _vessel.L.op - system.pump.elevation;
//         return _profile.hs;
//     }
//     var setInnerDia = function(_pipe){
//         _pipe.innerDia = pipeTable[_pipe.nps][_pipe.sch] / 1000;

//         return _pipe.innerDia;

//     }

//     var setHfPipe = function(_profile, _pipe, _vessel){
//         _profile.velocity = _pipe.flow_sf / (Math.pow(_pipe.innerDia,2) * (Math.PI / 4)) / 3600;
//         _profile.hv = Math.pow(_profile.velocity, 2) / (2 * 9.8);
//         _profile.ed = _pipe.roughness / _pipe.innerDia;
//         _profile.Re = _profile.velocity * _pipe.innerDia * _vessel.sg * 1000 / system.pump.viscosity;

//         var A = -2 * Math.log10((_profile.ed / 3.7) + (12 / _profile.Re));
//         var B = -2 * Math.log10((_profile.ed / 3.7) + (2.51 * A / _profile.Re));
//         var C = -2 * Math.log10((_profile.ed / 3.7) + (2.51 * B / _profile.Re));
//         _profile.friction = Math.pow(((A - Math.pow((B-A), 2)) / (C - (2 * B) + A)), -2);

//         _profile.LD = +_pipe.length / _pipe.innerDia;

//         _profile.hfPipe = _profile.friction * _profile.hv * _profile.LD;

//     }


//     scope.calculate = function(){

//         system.temp = scope.temp;
//         system.atmosP = scope.atmosP;
//         var eqLength = Object.keys(system.equipment).length;
//         // console.log(eqLength);
//         console.log(system.equipment);

//         var connFromLength, connToLength;

//         if(eqLength > 2){
//             for(var key in system.equipment){

//                 if(system.equipment[key].type === 'vessel'){
//                     connFromLength = Object.keys(system.equipment[key].connectionFrom).length;
//                     connToLength = Object.keys(system.equipment[key].connectionTo).length;
//                 }
//                 else{
//                     connFromLength = 0;
//                     connToLength = 0;
//                 }

//                 // console.log(connFromLength);
//                 // console.log(connToLength);

//                 if(connFromLength === 0 && connToLength > 0){
//                     console.log('starting calc');
//                     var suctionSide = new Profile();
//                     suctionSide.name = 'suction-side-' + system.equipment[key].name;

//                     system.head = system.equipment[key];
//                     // operating pressure * gravity accel

//                     // suctionSide.hp = system.head.P.op / (system.head.sg * 9.8);
//                     // suctionSide.hs = system.head.L.op - system.pump.elevation;

//                     setHp(suctionSide, system.head);
//                     setHs(suctionSide, system.head);

//                     var pipes = system.head.connectionToPipe;
//                     // iterate through pipes, but for sake of testing,  use the first key
//                     var pipeKeys = Object.keys(pipes);
//                     var pipe = pipes[pipeKeys[0]];
//                     if(typeof pipe.roughness == 'string') pipe.roughness = +pipe.roughness;

//                     setInnerDia(pipe);

//                     // console.log(innerDia);
//                     pipe.setFlow(system.sf);
//                     // var flow = system.pump.flow * system.sf;
//                     setHfPipe(suctionSide, pipe, system.equipment[key]);

//                     suctionSide.hf = suctionSide.hfPipe + suctionSide.hfFittings;
//                     suctionSide.h = suctionSide.hp + suctionSide.hs - suctionSide.hf;

//                     system.suction.push(suctionSide);
//                 }
//                 else if(connFromLength > 0 && connToLength === 0)

//                     if(system.equipment[key].type === 'vessel'){

//                         var dest = system.equipment[key];
//                         var dischargeSide = new Profile();
//                         dischargeSide.name = 'discharge-side-' + dest.name;

//                         // operating pressure * gravity accel
//                         setHs(dischargeSide, dest);
//                         setHp(dischargeSide, dest);


//                         var pipes = dest.connectionFromPipe;

//                         // iterate through pipes, but for sake of testing,  use the first key
//                         var pipeKeys = Object.keys(pipes);
//                         var pipe = pipes[pipeKeys[0]];

//                         if(typeof pipe.roughness == 'string') pipe.roughness = +pipe.roughness;
//                         setInnerDia(pipe);
//                         pipe.setFlow(system.sf);
//                         setHfPipe(dischargeSide, pipe, dest);
//                         dischargeSide.hf = dischargeSide.hfPipe + dischargeSide.hfFittings;
//                         dischargeSide.h = dischargeSide.hp + dischargeSide.hs + dischargeSide.hf;
//                         system.discharge.push(dischargeSide);
//                         // console.log(dischargeSide);
//                     }
//             }
//             // iterate over all of suction side profiles and discharge side profiles, find max and calculate tdh
//             // for testing purposes, hardcode suction and discharge side to the first entry
//             if(system.discharge.length > 0 && system.suction.length > 0)
//                 system.pump.tdh = system.discharge[0].h - system.suction[0].h;

//             else console.log('tdh error', system.discharge, system.suction);



//             // 0.133 is a conversion ratio
//             var vaporP = Math.pow(10, 8.06131 - (1730 / (+system.temp + 233.426))) * 0.133;


//             if (vaporP > (system.atmosP + system.head.P.op))
//                 vaporP = (system.head.P.op + system.atmosP);


//             system.pump.npsha = (system.head.L.op - system.pump.elevation) + system.suction[0].hp - ((vaporP - system.atmosP) * 0.10197 / system.head.sg) - system.suction[0].hf - system.suction[0].extraLoss;


//             //set data onto scope
//             scope.npsha = system.pump.npsha;
//             scope.dischargeP = system.discharge[0].h;
//             scope.suctionP = system.suction[0].h;
//             scope.dischargeV = system.discharge[0].velocity;
//             scope.suctionV = system.suction[0].velocity;
//             scope.tdh = system.pump.tdh;
//             scope.dischargeRe = system.discharge[0].Re;
//             scope.suctionRe = system.suction[0].Re;



//         }
//     }

//     // detach all connections and remove all pipes from the system
//     scope.disconnectAll = function(){
//         jsPlumb.detachEveryConnection();
//         system.pipes = [];
//         // for (var x = 0; x < system.pipes.length; x++){
//         //     system.pipes[x] = null;
//         // }
//     }


//     scope.connect = function(){
//     var connections = jsPlumb.getAllConnections();
//     connections.forEach(conn => {
//     var src = system.equipment[conn.source.id];
//     src.connections.push(conn.target.id);
//     })
//     }


//     }
//   }
// })

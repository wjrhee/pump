// scope.calculate = function(){

//   system.temp = scope.temp;
//   system.atmosP = scope.atmosP;
//   var eqLength = Object.keys(system.equipment).length;
//   // console.log(eqLength);
//   console.log(system.equipment);

//   var connFromLength, connToLength;

//   if(eqLength > 2){
//     for(var key in system.equipment){

//       if(system.equipment[key].type === 'vessel'){
//         connFromLength = Object.keys(system.equipment[key].connectionFrom).length;
//         connToLength = Object.keys(system.equipment[key].connectionTo).length;
//       }
//       else{
//         connFromLength = 0;
//         connToLength = 0;
//       }

//       // console.log(connFromLength);
//       // console.log(connToLength);

//       if(connFromLength === 0 && connToLength > 0){
//         console.log('starting calc');
//         var suctionSide = new Profile();
//         suctionSide.name = 'suction-side-' + system.equipment[key].name;

//         system.head = system.equipment[key];
//         // operating pressure * gravity accel

//         // suctionSide.hp = system.head.P.op / (system.head.sg * 9.8);
//         // suctionSide.hs = system.head.L.op - system.pump.elevation;

//         setHp(suctionSide, system.head);
//         setHs(suctionSide, system.head);

//         var pipes = system.head.connectionToPipe;
//         // iterate through pipes, but for sake of testing,  use the first key
//         var pipeKeys = Object.keys(pipes);
//         var pipe = pipes[pipeKeys[0]];
//         if(typeof pipe.roughness == 'string') pipe.roughness = +pipe.roughness;

//         setInnerDia(pipe);

//         // console.log(innerDia);
//         pipe.setFlow(system.sf);
//         // var flow = system.pump.flow * system.sf;
//         setHfPipe(suctionSide, pipe, system.equipment[key]);

//         suctionSide.hf = suctionSide.hfPipe + suctionSide.hfFittings;
//         suctionSide.h = suctionSide.hp + suctionSide.hs - suctionSide.hf;

//         system.suction.push(suctionSide);
//       }
//       else if(connFromLength > 0 && connToLength === 0)

//           if(system.equipment[key].type === 'vessel'){

//               var dest = system.equipment[key];
//               var dischargeSide = new Profile();
//               dischargeSide.name = 'discharge-side-' + dest.name;

//               // operating pressure * gravity accel
//               setHs(dischargeSide, dest);
//               setHp(dischargeSide, dest);


//               var pipes = dest.connectionFromPipe;

//               // iterate through pipes, but for sake of testing,  use the first key
//               var pipeKeys = Object.keys(pipes);
//               var pipe = pipes[pipeKeys[0]];

//               if(typeof pipe.roughness == 'string') pipe.roughness = +pipe.roughness;
//               setInnerDia(pipe);
//               pipe.setFlow(system.sf);
//               setHfPipe(dischargeSide, pipe, dest);
//               dischargeSide.hf = dischargeSide.hfPipe + dischargeSide.hfFittings;
//               dischargeSide.h = dischargeSide.hp + dischargeSide.hs + dischargeSide.hf;
//               system.discharge.push(dischargeSide);
//               // console.log(dischargeSide);
//           }
//       }
//       // iterate over all of suction side profiles and discharge side profiles, find max and calculate tdh
//       // for testing purposes, hardcode suction and discharge side to the first entry
//       if(system.discharge.length > 0 && system.suction.length > 0)
//           system.pump.tdh = system.discharge[0].h - system.suction[0].h;

//       else console.log('tdh error', system.discharge, system.suction);


//       // use Antoine Coefficients for water
//       // 0.133 is a conversion ratio
//       var vaporP = Math.pow(10, 8.06131 - (1730 / (+system.temp + 233.426))) * 0.133;


//       if (vaporP > (system.atmosP + system.head.P.op))
//           vaporP = (system.head.P.op + system.atmosP);


//       system.pump.npsha = (system.head.L.op - system.pump.elevation) + system.suction[0].hp - ((vaporP - system.atmosP) * 0.10197 / system.head.sg) - system.suction[0].hf - system.suction[0].extraLoss;


//       //set data onto scope
//       scope.npsha = system.pump.npsha;
//       scope.dischargeP = system.discharge[0].h;
//       scope.suctionP = system.suction[0].h;
//       scope.dischargeV = system.discharge[0].velocity;
//       scope.suctionV = system.suction[0].velocity;
//       scope.tdh = system.pump.tdh;
//       scope.dischargeRe = system.discharge[0].Re;
//       scope.suctionRe = system.suction[0].Re;



//     }
// }

// // detach all connections and remove all pipes from the system
// scope.disconnectAll = function(){
//     jsPlumb.detachEveryConnection();
//     system.pipes = [];
//     // for (var x = 0; x < system.pipes.length; x++){
//     //     system.pipes[x] = null;
//     // }
// }


// scope.connect = function(){
// var connections = jsPlumb.getAllConnections();
// connections.forEach(conn => {
// var src = system.equipment[conn.source.id];
// src.connections.push(conn.target.id);
// })
// }


// }
// }
// })

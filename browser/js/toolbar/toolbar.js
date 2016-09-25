
app.directive('toolbar', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'js/toolbar/toolbar.html',
    link: function(scope, element, attrs){

    scope.items = ['Vessel', 'Pump', 'Fitting'];
    scope.modes = ['edit', 'create'];
    scope.mode = 'create';

    scope.equipment = [];

    jsPlumb.bind('connectionDragStop', function(conn){
        if(conn.source && conn.target){
            var src = system.equipment[conn.source.id];
            var tgt = system.equipment[conn.target.id];
            // console.log(src);


            // src.connections.push(conn.target.id);

            // initialize new pipe and store it into the system

            var pipeName = 'pipe-' + conn.source.id + '-' + conn.target.id;
            var newPipe = new Pipe(pipeName);
            system.equipment[pipeName] = newPipe;
            scope.equipment.push(newPipe);

            // system.equipment[conn.source.id].connected = true;
            // system.equipment[conn.target.id].connected = true;
            src.connectionTo[conn.target.id] = conn.target;
            src.connectionToPipe[pipeName] = newPipe;

            tgt.connectionFrom[conn.source.id] = conn.source;
            tgt.connectionFromPipe[pipeName] = newPipe;

            console.log(system.equipment);

        }
    })

// take type of equipment to be created as string and create svg element and new instance of equipment
      scope.create = function(t){

        switch (t){
          case 'Vessel':
            addEq(scope.vessel.name, '#vesselSVG');

            var vessel = new Vessel(scope.vessel);
            system.equipment[scope.vessel.name] = vessel;
            scope.equipment.push(vessel);

            if (scope.sf) system.sf = scope.sf;

            break;
          case 'Pump':
            if(!system.pump){
                addEq(scope.pump.name, '#pumpSVG');

                var pump = new Pump(scope.pump.flow, scope.pump.name);
                system.equipment[scope.pump.name] = pump;
                scope.equipment.push(pump);
                if(scope.sf) system.sf = scope.sf;
                system.pump = pump;
            }
            else{
                console.log('already have a pump');
            }

            break;
            // create case for fittings

          default:
            break;
        }
      }



      scope.calculate = function(){
        // var size = Object.keys(myObj).length;

        if(system.equipment.length > 2){
            system.equipment.forEach(item => {
                var connFromLength = Object.keys(item.connectionFrom).length;
                var connToLength = Object.keys(item.connectionTo).length;

                if(connFromLength === 0 && connToLength > 0){
                    var suctionSide = new Profile();

                    system.head = item;
                    // operating pressure * gravity accel
                    suctionSide.hps = system.head.P.op / (system.head.sg * 9.8);
                    suctionSide.hss = system.head.L.op - system.pump.elevation;
                    var pipe = system.head[connectionToPipe];
                    console.log(pipe);
                    var innerDia = pipeTable[pipe.nps][pipe.sch] / 1000;
                    console.log(innerDia);

                    suctionSide.velocity = system.pump.flow / (Math.pow(innerDia,2) * (Math.PI / 4)) / 3600;
                    console.log(suctionSide.velocity);
                    suctionSide.hv = Math.pow(suctionSide.velocity, 2) / (2 * 9.8);
                    suctionSide.ed = pipe.roughness / innerDia;
                    suctionSide.Re = suctionSide.velocity * innerDia * system.head.sg * 1000000 / system.pump.viscosity;

                    var A = -2 * Math.log10 * (pipe.roughness / (3.7 * innerDia + (12 / suctionSide.Re)));
                    var B = -2 * Math.log10 * (pipe.roughness / (3.7 * innerDia + (2.51 * A / suctionSide.Re)));
                    var C = -2 * Math.log10 * (pipe.roughness / (3.7 * innerDia + (2.51 * B / suctionSide.Re)));
                    suctionSide.friction = Math.pow((A - Math.pow(B-A, 2)) / (C - 2 * B + A), -2);

                    suctionSide.LD = pipe.length / innerDia;

                    suctionSide.hfPipe = suctionSide.friction * suctionSide.hv * suctionSide.LD;
                    suctionSide.hf = suctionSide.hfPipe + suctionSide.hfFittings;

                    console.log(suctionSide);
                    system.suction.push(suctionSide);



                }
            })
            if(!head){
                console.log('system not properly connected');
                return 0;
            }
        }


      }

      scope.connect = function(){
        var connections = jsPlumb.getAllConnections();
        connections.forEach(conn => {
            var src = system.equipment[conn.source.id];
            src.connections.push(conn.target.id);
        })
      }

      scope.editpipe = function(name){
        // console.log(system.equipment[name])
        // var pipe = system.equipment[scope.source.name];

        console.log(scope.source);
        console.log(system.equipment[scope.source.name])
        // console.log(name);

      }

      scope.editvessel = function(){
        console.log(source);

      }
      scope.editpump = function(){
        console.log(source);

      }

    }
  }
})

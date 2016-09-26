
app.directive('toolbar', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'js/toolbar/toolbar.html',
    link: function(scope, element, attrs){

    scope.items = ['Vessel', 'Pump', 'Fitting'];
    scope.modes = ['edit', 'create'];
    scope.mode = 'create';

    scope.equipment = [];

    scope.sch = ['5', '10', '20', '30', '40', 'STD', '80', 'XS'];
    scope.nps = Object.keys(pipeTable);
    // scope.nps = ['6', '8', '10', '15', '20', '25', '32', '40', '50', '65', '80', '90', '100', '125', '150'];


    jsPlumb.bind('connectionDragStop', function(conn){


        if(system.equipment[conn.source.id] && system.equipment[conn.target.id]){
            var src = system.equipment[conn.source.id];
            var tgt = system.equipment[conn.target.id];
            // console.log(src);


            // src.connections.push(conn.target.id);

            // initialize new pipe and store it into the system

            var pipeName = 'pipe-' + conn.source.id + '-' + conn.target.id;
            var newPipe = new Pipe(pipeName);
            newPipe.start = conn.source.id;
            newPipe.end = conn.target.id;
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
        else{
            console.log('pipe not created.  no connection');
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

    var setHp = function(_profile, _vessel){
        _profile.hp = _vessel.P.op / (_vessel.sg * 9.8);
        return _profile.hp;

    }
    var setHs = function(_profile, _vessel){
        _profile.hs = _vessel.L.op - system.pump.elevation;
        return _profile.hs;
    }
    var setInnerDia = function(_pipe){
        _pipe.innerDia = pipeTable[_pipe.nps][_pipe.sch] / 1000;

        return _pipe.innerDia;

    }

    var setHfPipe = function(_profile, _pipe, _vessel){
        _profile.velocity = _pipe.flow_sf / (Math.pow(_pipe.innerDia,2) * (Math.PI / 4)) / 3600;
        _profile.hv = Math.pow(_profile.velocity, 2) / (2 * 9.8);
        _profile.ed = _pipe.roughness / _pipe.innerDia;
        _profile.Re = _profile.velocity * _pipe.innerDia * _vessel.sg * 1000 / system.pump.viscosity;

        var A = -2 * Math.log10((_profile.ed / 3.7) + (12 / _profile.Re));
        var B = -2 * Math.log10((_profile.ed / 3.7) + (2.51 * A / _profile.Re));
        var C = -2 * Math.log10((_profile.ed / 3.7) + (2.51 * B / _profile.Re));
        _profile.friction = Math.pow(((A - Math.pow((B-A), 2)) / (C - (2 * B) + A)), -2);

        _profile.LD = +_pipe.length / _pipe.innerDia;

        _profile.hfPipe = _profile.friction * _profile.hv * _profile.LD;



    }

      // for testing
      // var testPipe = new Pipe();
      // testPipe.nps = '40';


    scope.calculate = function(){
        // console.log(pipeTable['6']);
    // console.log(pipeTable[6][10]);
        // var size = Object.keys(myObj).length;
        system.temp = scope.temp;
        system.atmosP = scope.atmosP;
        var eqLength = Object.keys(system.equipment).length;
        // console.log(eqLength);
        console.log(system.equipment);

        var connFromLength, connToLength;

        if(eqLength > 2){
            for(var key in system.equipment){

                if(system.equipment[key].type === 'vessel'){
                    connFromLength = Object.keys(system.equipment[key].connectionFrom).length;
                    connToLength = Object.keys(system.equipment[key].connectionTo).length;
                }
                else{
                    connFromLength = 0;
                    connToLength = 0;
                }

                // console.log(connFromLength);
                // console.log(connToLength);

                if(connFromLength === 0 && connToLength > 0){
                    console.log('starting calc');
                    var suctionSide = new Profile();
                    suctionSide.name = 'suction-side-' + system.equipment[key].name;

                    system.head = system.equipment[key];
                    // operating pressure * gravity accel

                    // suctionSide.hp = system.head.P.op / (system.head.sg * 9.8);
                    // suctionSide.hs = system.head.L.op - system.pump.elevation;

                    setHp(suctionSide, system.head);
                    setHs(suctionSide, system.head);

                    var pipes = system.head.connectionToPipe;
                    // iterate through pipes, but for sake of testing,  use the first key
                    var pipeKeys = Object.keys(pipes);
                    var pipe = pipes[pipeKeys[0]];
                    if(typeof pipe.roughness == 'string') pipe.roughness = +pipe.roughness;

                    setInnerDia(pipe);

                    // console.log(innerDia);
                    pipe.setFlow(system.sf);
                    // var flow = system.pump.flow * system.sf;
                    setHfPipe(suctionSide, pipe, system.equipment[key]);

                    suctionSide.hf = suctionSide.hfPipe + suctionSide.hfFittings;
                    suctionSide.h = suctionSide.hp + suctionSide.hs - suctionSide.hf;

                    system.suction.push(suctionSide);
                }
                else if(connFromLength > 0 && connToLength === 0)

                    if(system.equipment[key].type === 'vessel'){

                        var dest = system.equipment[key];
                        var dischargeSide = new Profile();
                        dischargeSide.name = 'discharge-side-' + dest.name;

                        // operating pressure * gravity accel
                        setHs(dischargeSide, dest);
                        setHp(dischargeSide, dest);
                        // suctionSide.hp = dest.P.op / (dest.sg * 9.8);
                        // suctionSide.hs = dest.L.op - system.pump.elevation;

                        var pipes = dest.connectionFromPipe;
                        // console.log(pipes);
                        // iterate through pipes, but for sake of testing,  use the first key
                        var pipeKeys = Object.keys(pipes);
                        var pipe = pipes[pipeKeys[0]];

                        if(typeof pipe.roughness == 'string') pipe.roughness = +pipe.roughness;
                        setInnerDia(pipe);
                        pipe.setFlow(system.sf);
                        setHfPipe(dischargeSide, pipe, dest);
                        dischargeSide.hf = dischargeSide.hfPipe + dischargeSide.hfFittings;
                        dischargeSide.h = dischargeSide.hp + dischargeSide.hs + dischargeSide.hf;
                        system.discharge.push(dischargeSide);
                        // console.log(dischargeSide);
                    }
            }
            // iterate over all of suction side profiles and discharge side profiles, find max and calculate tdh
            // for testing purposes, hardcode suction and discharge side to the first entry
            if(system.discharge.length > 0 && system.suction.length > 0)
                system.pump.tdh = system.discharge[0] - system.suction[0];

            else console.log('tdh error', system.discharge, system.suction);
            console.log(pump);

            // B36 = atmospheric pressure
            // G9 = vessel pressure
            // B38 = temp deg C
            // IF( (10^( 8.07131-1730.63/( B38+233.426))*0.00135951)>(G9+B36),
            // (G9+B36),
            // (10^(8.07131-1730.63/(B38+233.426))*0.00135951))

            // =IF(EXP((14.413*C51-1466.55)/(C51+379.38))>C51,
            // E12,
            // EXP((14.413*C51-1466.55)/(C51+379.38)))
            // temp = system.temp;
            // 0.133 conversion from mmHg -> kPa
            var vaporP = Math.pow(10, (8.07131 - (1730.63 / (system.temp + 233.426)))) * 0.133;
            console.log('vaporP',vaporP);
            console.log('system temp', system.temp);
            if (vaporP > (system.atmosP + system.head.P.op))
                vaporP = (system.head.P.op + system.atmosP);
            console.log('after comparison',system.head.P.op);


            console.log('pressure head',system.suction[0].hp);
            console.log('atmos p',system.atmosP);
            console.log('sg', system.head.sg);


            system.pump.npsha = (system.head.L.op - system.pump.elevation) + system.suction[0].hp - ((vaporP - system.atmosP) * 0.10197 / system.head.sg) - system.suction[0].hf - system.suction[0].extraLoss;

            console.log(system.pump.npsha);

            // =(G10-B33)+G4-(B37-B36)*2.31/B31-G6-G5




            // calculate NPSHa




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

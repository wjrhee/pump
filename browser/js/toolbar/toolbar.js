
app.directive('toolbar', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'js/toolbar/toolbar.html',
    link: function(scope, element, attrs){

    scope.items = ['Vessel', 'Pump', 'Fitting'];
    scope.modes = ['edit', 'create'];

    scope.equipment = [];

    jsPlumb.bind('connectionDragStop', function(conn){
        if(conn.source && conn.target){
            var src = system.equipment[conn.source.id];
            // console.log(src);
            src.connections.push(conn.target.id);

            // initialize new pipe and store it into the system

            var pipeName = 'pipe-' + conn.source.id + '-' + conn.target.id;
            var newPipe = new Pipe(pipeName);
            system.equipment[pipeName] = newPipe;
            scope.equipment.push(newPipe);

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
            addEq(scope.pump.name, '#pumpSVG');

            var pump = new Pump(scope.pump.flow, scope.pump.name);
            system.equipment[scope.pump.name] = pump;
            scope.equipment.push(pump);
            if(scope.sf) system.sf = scope.sf;

            break;
            // create case for fittings

          default:
            break;
        }
      }

      scope.calculate = function(){


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

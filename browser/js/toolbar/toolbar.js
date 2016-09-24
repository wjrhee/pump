
app.directive('toolbar', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'js/toolbar/toolbar.html',
    link: function(scope, element, attrs){

      scope.items = ['Vessel', 'Pump', 'Fitting'];

      var cloneAndDisplay = function(tag){
        var item = $(tag).clone();
        item.draggable({
          snap: true,
          snapMode: 'outer',
          stop: colorSnapped
        });
        item.removeAttr('display');
        item.appendTo('#main');
      }
      scope.equipment = [];

// take type of equipment to be created as string and create svg element and new instance of equipment
      scope.create = function(t){
        console.log(scope.vessel);

        switch (t){
          case 'Vessel':
            cloneAndDisplay('#vesselSVG');
            var vessel = new Vessel(scope.vessel);
            system.equipment.push(vessel);
            scope.equipment.push(vessel);

            if (scope.sf) system.sf = scope.sf;

            break;
          case 'Pump':
            cloneAndDisplay('#pumpSVG');
            var pump = new Pump(scope.pump.flow, scope.pump.name);
scope.equipment.push(pump);
            system.equipment.push(pump);
            if(scope.sf) system.sf = scope.sf;
            // scope.$digest();

            break;
            // create case for fittings

          default:
            break;
        }
      }

    }
  }
})

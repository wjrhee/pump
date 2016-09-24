
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


// take type of equipment to be created as string and create svg element and new instance of equipment
      scope.create = function(t){
        console.log(scope.vessel);

        switch (t){
          case 'Vessel':
            cloneAndDisplay('#vesselSVG');
            var vessel = new Vessel(scope.vessel);
            system.vessels.push(vessel);
            if (scope.sf) system.sf = scope.sf;
            console.log(system);

            break;
          case 'Pump':
            cloneAndDisplay('#pumpSVG');
            break;
            // create case for fittings

          default:
            break;
        }
      }

    }
  }
})

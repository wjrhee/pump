
app.directive('toolbar', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'js/toolbar/toolbar.html',
    link: function(scope, element, attrs){

      scope.items = ['Vessel', 'Pump', 'Fitting'];
      scope.selector = {
        vessel: false,
        pump: false,
        fitting: false

      }
      if(scope.type === 'Vessel') console.log(scope.type);

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

      scope.create = function(t){
        switch(t){
          case 'Vessel':
            cloneAndDisplay('#vesselSVG');

            break;
          case 'Pump':
            cloneAndDisplay('#pumpSVG');
            break;
            // create case for fittings

          default:
            break;
        }

        // var vessel = $('#vesselSVG').clone();
        // var pump = $('#pumpSVG').clone();
        // vessel.attr({
        //   display: ''
        // })
        // pump.attr({
        //   display: ''
        // })
        // vessel.appendTo('#main');
        // console.log(vessel)
        // console.log(pump);

    //     var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //     var svgNS = svg.namespaceURI;
    //     svg.setAttribute('height', '100px');
    //     svg.setAttribute('width', '60px');

    // var rect = document.createElementNS(svgNS,'rect');
    // rect.setAttribute('x',0);
    // rect.setAttribute('y',0);
    // rect.setAttribute('width',60);
    // rect.setAttribute('height',100);
    // rect.setAttribute('fill','#95B3D7');
    // svg.appendChild(rect);
    // document.body.appendChild(svg);

    // var h=document.createElement('a');
    // var t=document.createTextNode('Hello World');
    // h.appendChild(t);
    // document.body.appendChild(h);

// document.body.appendChild(svg);
        // var draw = SVG('drawing').size(60, 100);
        // var rect = draw.rect(60,100).attr({fill: '#000'});

        // var object = document.createElement("object");
        // console.log($(object).draggable());
        // // $(object).draggable();
        //      object.type = "image/svg+xml";
        //      object.data = 'img/pump.svg';


        //      element.append($(object).clone());
        //      console.log($('object'));

        // var ajax = new XMLHttpRequest()
        // ajax.open('GET', 'img/vessel.svg', true)
        // ajax.send()
        // ajax.onload = function(e) {
        //   draw.svg(ajax.responseText)
        // }


        // var x = document.createElement('svg');
        // var a = document.createElement('rect');
        // $(a).attr({
        //   width:'60',
        //   height:'100',
        //   fill: 'black'
        // });
        // $(x).attr({
        //   height: '100px',
        //   width: '60px',
        //   viewBox: '0 0 60 100',
        //   xmlns: 'http://www.w3.org/2000/svg'
        // });
        // $(x).append(a);
        // $('#main').append(x);
        // console.log(x);



         // var myCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
         //  angular.element(myCircle).attr('r', 50);
         //  angular.element(myCircle).attr('cx', 100);
         //  angular.element(myCircle).attr('cy', 100);
         //  var s = document.createElementNS('svg');



         //  element.append(s);


         //  console.log(myCircle);

        // var x = document.createElement('custom');
        // console.log(x);
        // $('#main').append(x);
        // scope.$digest();

        // var element = $('#main');
        // document.getElementById('main');
        // var object = document.createElement("object");
        // $(object).draggable();
        //      object.type = "image/svg+xml";
        //      object.data = 'img/pump.svg';
        //      console.log(object);

        //      element.append($(object).clone());

        // var x = $('#main').load('/img/vessel.svg');
        // console.log(x);
        // $('#main').append(x);


        // $.get('/img/pump.svg', function(data){
        //   console.log(data);
        //   $('#main').append(data);
        //   // $bg.append(data);
        // })
        // console.log(t);
        // var draw = SVG('drawing');
        // var x = SVG.get('canvas');
        // console.log(x);

        // <svg viewBox="0 0 100 100">
        //    <use xlink:href="defs.svg#icon-1"></use>
        // </svg>
        // var draw = SVG('drawing').size(300, 300)
        // var rect = draw.rect(100, 100).attr({ fill: '#f06' })
        // draw.svg('/img/pump.svg')
        // var test = draw.use('/img/pump.svg');
        // console.log(test);
        // $('#main').append('<svg width="30" height="30"><rect width="30" height="30" stroke="black"></svg>')
        // $('svg').draggable({
        //   snap: true,
        //   snapMode: 'outer'
        // });
      }

    }
  }
})

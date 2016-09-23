window.app = angular.module('app', []);
var connectColor = 'green';
var disconnectColor = 'black';

class Vessel{
  constructor(id, svg, min_P = null, max_P = null, op_P = null, min_T = null, max_T = null, op_T = null, min_L = null, max_L = null, op_L = null, sg = null, composition = null){
    this.P = {
      min: min_P,
      max: max_P,
      op: op_P
    }
    this.T = {
      min: min_T,
      max: max_T,
      op: op_T
    }
    this.L = {
      min: min_L,
      max: max_L,
      op: op_L
    }
    this.sg = sg;
    this.composition = composition;
    this.svg = svg;
    this.id = id;
    this.connections = [];
  }
}

class Pipe{
  constructor(length, matl='316', nom_size, sch, flow, velocity){
    this.fittings = {};
    this.length = length;
    this.matl = matl;
    this.nom_size = nom_size;
    this.sch = sch;
    this.start = null;
    this.end = null;
  }
}

class Pump{
  constructor(flow){
    this.connections = [];
    this.tdh = null;
    this.suction_P = null;
    this.discharge_P = null;
    this.npsha = null;
    this.flow = flow;
    this.connections = [];
  }
}



var colorChild = function(svgElem, color){
  Array.from($(svgElem).children()).forEach(child => {
    $(child).attr('fill', color);
  })
}

var colorSnapped = function() {

    var allDraggables = $('svg');
    for(var x = 0; x < allDraggables.length; x++){
      // console.log($(allDraggables[x]).draggable().data('uiDraggable').snapElements);
      if(!$(allDraggables[x]).draggable().data('uiDraggable').snapElements){
        $(allDraggables[x]).draggable().data('uiDraggable').snapElements = [];

        colorChild(allDraggables[x], disconnectColor);
      }
        // console.log($(allDraggables[x]).draggable().data('uiDraggable').snapElements);
        Array.from($(allDraggables[x]).draggable().data('uiDraggable').snapElements).forEach(function(item){
          if(item.snapping){
            console.log(item);
            $(item.item.id)
            colorChild(item.item, connectColor);
            colorChild(allDraggables[x], connectColor);
          }
          else if(Array.from($(allDraggables[x]).draggable().data('uiDraggable').snapElements).every(function(item){
            return !item.snapping;
          })){
            colorChild(allDraggables[x], disconnectColor);

          }
        })

    }

  }

$('svg').draggable({
  snap: true,
  snapMode: 'outer',
  stop: colorSnapped
});


var createSVG = function(){
  var svg = document.createElement('svg');
  $(svg).draggable();
  return svg;

}

var createPump = function(){
  var svg = createSVG();
  $('<rect height="30" width="30">').appendTo(svg);
  console.log(svg);
  $(svg).appendTo('#main');
}

$('#create').on('click', function(){
  // createPump();
  $('#main').append('<svg width="30" height="30"><rect width="30" height="30" stroke="black"></svg>')
  $('svg').draggable({
    snap: true,
    snapMode: 'outer'
  });
})


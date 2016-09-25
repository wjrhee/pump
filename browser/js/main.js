window.app = angular.module('app', []);
var connectColor = 'green';
var disconnectColor = 'black';


class System{
  constructor(){
    this.equipment = {};
    this.pipes = [];
  }
}

class Vessel{
  constructor(data){
    this.type = 'vessel';
    this.name = data.name;
    this.P = {
      min: data.min_P,
      max: data.max_P,
      op: data.op_P
    }
    this.T = {
      min: data.min_T,
      max: data.max_T,
      op: data.op_T
    }
    this.L = {
      min: data.min_L,
      max: data.max_L,
      op: data.op_L
    }
    this.sg = data.sg;
    this.composition = data.composition;
    this.svg = data.svg;
    this.id = data.id;
    this.connections = [];
  }
}

class Pipe{
  constructor(name){
    this.name = name;
    this.type = "pipe";
    this.fittings = {};
    this.length = 0;
    this.matl = '316';
    this.nom_size = null;
    this.sch = null;
    this.start = null;
    this.end = null;
  }
}

class Pump{
  constructor(flow, name){
    this.type = 'pump';
    this.name = name;
    this.connections = [];
    this.tdh = null;
    this.suction_P = null;
    this.discharge_P = null;
    this.npsha = null;
    this.flow = flow;
    this.connections = [];
  }
}

var system = new System();


var colorChild = function(svgElem, color){
  Array.from($(svgElem).children()).forEach(child => {
    $(child).attr('fill', color);
  })
}

var colorSnapped = function() {

    var allDraggables = $('svg');
    for(var x = 0; x < allDraggables.length; x++){

      if(!$(allDraggables[x]).draggable().data('uiDraggable').snapElements){
        $(allDraggables[x]).draggable().data('uiDraggable').snapElements = [];

        colorChild(allDraggables[x], disconnectColor);
      }

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



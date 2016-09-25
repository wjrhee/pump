window.app = angular.module('app', []);

//pipeTable[nps][sch]
var pipeTable = {};
pipeTable = {
  6: {
    OD: 10.3,
    5: 8.5,
    10: 7.8,
    30: 7.4,
    40: 6.8,
    STD: 6.8,
    80: 5.5,
    XS: 5.5
  },
  8: {
    OD: 13.7,
    5: 11.2,
    10: 10.4,
    30: 10.0,
    40: 9.3,
    STD: 9.3,
    80: 7.7,
    XS: 7.7
  },
  10: {
    OD: 17.2,
    5: 14.7,
    10: 13.8,
    30: 13.4,
    40: 12.5,
    STD: 12.5,
    80: 10.8,
    XS: 10.8
  },
  15: {
    OD: 21.3,
    5: 18.0,
    10: 17.1,
    30: 15.8,
    40: 15.8,
    STD: 15.8,
    80: 13.9,
    XS: 13.9
  },
  20: {
    OD: 26.7,
    5: 23.4,
    10: 22.5,
    30: 20.9,
    40: 20.9,
    STD: 20.9,
    80: 18.8,
    XS: 18.8
  },
  25: {
    OD: 33.4,
    5: 30.1,
    10: 27.9,
    30: 26.6,
    40: 26.6,
    STD: 26.6,
    80: 24.3,
    XS: 24.3
  },
  32: {
    OD: 42.2,
    5: 38.9,
    10: 36.6,
    30: 36.2,
    40: 35.0,
    STD: 35.0,
    80: 32.5,
    XS: 32.5
  },
  40: {
    OD: 48.3,
    5: 45.0,
    10: 42.7,
    30: 41.9,
    40: 40.9,
    STD: 40.9,
    80: 38.1,
    XS: 38.1
  },
  50: {
    OD: 60.3,
    5: 57.0,
    10: 54.8,
    30: 54.0,
    40: 52.5,
    STD: 52.5,
    80: 49.3,
    XS: 49.3
  },
  65: {
    OD: 73.0,
    5: 68.8,
    10: 66.9,
    30: 63.5,
    40: 62.7,
    STD: 62.7,
    80: 59.0,
    XS: 59.0
  },
  //finished here
  80: {
    OD:88.9,
    5: 84.7,
    10: 82.8,
    30: 79.4,
    40: 77.9,
    STD: 77.9,
    80: 73.7,
    XS: 73.7
  },
  90: {
    OD: 101.6,
    5: 97.4,
    10: 95.5,
    30: 92.1,
    40: 90.1,
    STD: 90.1,
    80: 85.4,
    XS: 85.4
  },
  100: {
    OD: 114.3,
    5: 110.1,
    10: 108.2,
    30: 104.8,
    40: 102.3,
    STD: 102.3,
    80: 97.2,
    XS: 97.2
  },
  125: {
    OD: 141.3,
    5: 135.8,
    10: 134.5,
    30: 128.2,
    40: 128.2,
    STD: 128.2,
    80: 122.3,
    XS: 128.2
  },
  150: {
    5: 168.3,
    10: 162.7,
    30: 161.5,
    40: 154.0,
    STD: 154.0,
    80: 146.3,
    XS: 146.3
  }
}
console.log(pipeTable);



class System{
  constructor(){
    this.equipment = {};
    this.pipes = [];
    this.head = null;
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



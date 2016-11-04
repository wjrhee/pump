var xlsx = require('xlsx');
var workbook = xlsx.readFile('../../public/pipe.xlsx');
var sheetNames = workbook.SheetNames;
var pipeTable = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

console.log(pipeTable);


class Profile{
  constructor(){
    this.name = null;
    this.h = 0;
    this.hs = 0;
    this.hf = 0;
    this.hp = 0;
    this.hfPipe = 0;
    this.hfFittings = 0;
    this.LD = 0;
    this.ed = 0;
    this.Re = 0;
    this.friction = 0;
    this.hv = 0;
    this.velocity = 0;
    this.extraLoss = 0;
  }
}

class System{
  constructor(){
    // default system values
    this.equipment = {};
    this.pipes = [];
    this.head = null;
    this.suction = [];
    this.discharge = [];
    this.atmosP = 101;
    this.sf = 1;
    this.pump = null;
    this.temp = 0;
  }
}

class Equipment{
  constructor(){
    this.connectionTo = [];
    this.connectionFrom = [];
  }
}

class Vessel extends Equipment{

  constructor(data){
    super();
    this.connected = false;
    this.type = 'vessel';
    this.name = data.name;
    this.P = {
      min: data.min_P,
      max: data.max_P,
      op: data.op_P
    }
    // this.T = {
    //   min: data.min_T,
    //   max: data.max_T,
    //   op: data.op_T
    // }
    this.L = {
      min: data.min_L,
      max: data.max_L,
      op: data.op_L
    }
    this.sg = data.sg;
    this.composition = data.composition;
    // this.svg = data.svg;
    // this.id = data.id;
  }
}

class Pipe{
  constructor(name){
    this.name = name;
    this.type = "pipe";
    this.roughness = 0.00009144;
    this.flow = 0;
    this.flow_sf = 0;
    this.fittings = [];
    this.length = 0;
    this.matl = '316';
    this.nps = null;
    this.sch = null;
    this.start = null;
    this.end = null;
    this.innerDia = null;
    this.connectionTo = [];
    this.connectionFrom = [];
  }

  setFlow(sf){
    this.flow_sf = this.flow * sf;
  }

}

class Pump extends Equipment{
  constructor(flow, name, viscosity=0.00089){
    super();
    this.viscosity = viscosity;
    this.elevation = 1;
    this.type = 'pump';
    this.name = name;
    // this.connections = [];
    this.tdh = null;
    this.suction_P = null;
    this.discharge_P = null;
    this.npsha = null;
    this.flow = flow;
  }
}

var system = new System();



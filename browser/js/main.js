// what are valid systems?
// vessel - pump - vessel
// vessel - vessel
// if there's a pump there HAS to be a source and target
// multiple pumps linked is ok.
// Every pipe needs to have a source and target.  Cannot go to nowhere.

// MUST HAVE A PUMP

class System{
  constructor(){
    // default system values
    this.equipment = {};
    this.pipes = {};
    this.heads = [];
    this.elevationAtGrade = 0; // in meters
    this.atmosP = 101;
    this.sf = 1;
    this.pumps = [];
    this.temp = 0;
    // this.viscosity = 0.00089;
  }
}

// setup a check function to determine if the system is set up in a way to allow for a calculation

System.prototype.check = function(){

  // check that all pipes are connected on both ends
  for(var key in this.pipes){
    if(!this.pipes[key].source || !this.pipes[key].target){
      return false;
    }
  }
  // check if the pump is connected on both ends.
  // if the pump is connected on both ends, we know the pipes have both a target and source so the system must be complete.
  // check if pumps even exist and push all pumps into the system array
  var isThereAPump = false;

  for(var key in this.equipment){
    if(this.equipment[key] instanceof Pump){
      if(this.equipment[key].connectionTo.length === 0 || this.equipment[key].connectionFrom.length === 0){
        return false;
      }
      isThereAPump = true;
      this.pumps.push(this.equipment[key]);
    }
  }
  if(isThereAPump){
    return true;
  }
  else{
    return false;
  }
}


System.prototype.calculate = function(npsTable){
  // check to see if the system can be calculated
  // start at the pumps and work in both direction? middle out?
  var traverseBackPath = function(item){
    if(item.connectionFrom.length > 0){
      item.connectionFrom.forEach(conn => {
        traverseBackPath(conn);
      })
    }
  }
  var traverseForwardPath = function(item){
    if(item.connectionTo.length > 0){
      item.connectionTo.forEach(conn => {
        traverseForwardPath(conn);
      })
    }
  }
  this.pumps.forEach(pump => {
    // flow through each path to and from
    pump.connectionFrom.forEach(conn => {
      traverseBackPath(conn);
    })
    pump.connectionTo.forEach(conn => {
      traverseForwardPath(conn);
    })
  })



  this.findHeads();
  this.heads.forEach(head => {

    // console.log(head instanceof Vessel);
    // console.log(head, this.elevationAtGrade);
    head.calcHs(head, this.elevationAtGrade);
    head.calcHp(head);
    var queue = []
    head.connectionTo.forEach(connection => {
      queue.push(connection);
    })

    while(queue.length > 0){
      var item = queue.pop();
      if(!item.profile){
          item.profile = new Profile();
        }
      if(item instanceof Pipe){
        item.calcInnerDiameter(npsTable);
        item.setFlow();
        item.profile.calcVelocity(item.flow_sf, item.innerDiameter);
        console.log(item);
        item.profile.calcHfPipe(item, item.sg);
      }
      else if(item instanceof Vessel){
        item.profile.calcHs(head, this.elevationAtGrade);
        item.profile.calcHp(head);
        // TODO: case for vessel
      }
      else if(item instanceof Pump){

        // TODO: case for pump
      }
      if(item.connectionTo.length > 0){
        item.connectionTo.forEach(connection => {
          queue.push(connection);
        })
      }
    }
  })
}


System.prototype.findHeads = function(){
  // find all the starting points for the calculation
  for(var key in this.equipment){
    // console.log(this.equipment[key]);
    if(this.equipment[key].connectionFrom.length === 0){
      this.heads.push(this.equipment[key]);
    }
  }
  this.heads.forEach(head => {
    head.profile = new Profile();
  })

}

class Profile{
  constructor(viscosity = 0.00089){
    this.name = null;
    this.h = {
      min: 0,
      op: 0,
      max: 0
    };
    this.hs = {
      min: 0,
      op: 0,
      max: 0
    };
    this.hp = {
      min: 0,
      op: 0,
      max: 0
    };
    this.hf = 0;
    this.hfPipe = 0;
    this.hfFittings = 0;

    this.LD = 0;
    this.ed = 0;
    this.Re = 0;
    this.friction = 0;
    this.hv = 0;
    this.velocity = 0;
    this.extraLoss = 0;
    this.viscosity = viscosity;
  }
}

// pass in specific gravity, in cases where the specific gravity of target vessel is different from the specific gravity of the source pump?

Profile.prototype.calcHs = function(vessel, elAtGrade){
  for(var key in this.hs){
    this.hs[key] = vessel.L[key] - elAtGrade;
  }
  return this.hs;
}

Profile.prototype.calcHp = function(vessel){
  for(var key in this.hp){
    this.hp[key] = vessel.P[key] / (vessel.sg * 9.8);
  }
  return this.hp;
}

Profile.prototype.calcHfPipe = function(pipe, sg){
  this.hv = Math.pow(this.velocity, 2) / (2 * 9.8);
  this.ed = pipe.roughness / pipe.innerDiameter;
  this.Re = this.velocity * pipe.innerDiameter * sg * 1000 / this.viscosity;
  var A = -2 * Math.log10((this.ed / 3.7) + (12 / this.Re));
  var B = -2 * Math.log10((this.ed / 3.7) + (2.51 * A / this.Re));
  var C = -2 * Math.log10((this.ed / 3.7) + (2.51 * B / this.Re));
  this.friction = Math.pow(((A - Math.pow((B - A), 2)) / (C - (2 * B) + A)), -2);
  this.LD = +pipe.length / pipe.innerDiameter;
  this.hfPipe = this.friction * this.hv * this.LD;
  return this.hfPipe;
}


// TODO: MOVE THIS INTO calcHfPipe
Profile.prototype.calcVelocity = function(flow, diameter){
  this.velocity = flow / (Math.pow(diameter, 2) * (Math.PI / 4)) / 3600;
  return this.velocity;
}


class Equipment{
  constructor(name){
    this.connectionTo = [];
    this.connectionFrom = [];
    this.name = name;
  }
}

class Vessel extends Equipment{

  constructor(data){
    super(data.name);
    // this.connected = false;
    // this.name = data.name;

    this.type = 'vessel';
    // it might not seem to make sense to create the 'type' property but it makes it easier for determining the type for ng-show logic

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
    this.viscosity = data.viscosity ? data.viscosity : 0.00089;
    this.sg = data.sg;
    // this.composition = data.composition;
    // this.svg = data.svg;
    // this.id = data.id;
  }
}

class Pump extends Equipment{
  constructor(data){
    super(data.name);
    // this.viscosity = viscosity;
    this.elevation = data.elevation ? data.elevation : 1;
    // this.name = name;
    this.type = 'pump';
    // this.connections = [];
    this.tdh = [];
    this.suction_P = [];
    this.discharge_P = [];
    this.npsha = null;
    this.flow = data.flow;
  }
}

Pump.prototype.calcTDH = function(){
  this.suction_P.forEach(hs => {
    this.discharge_P.forEach(hd => {
      this.tdh.push(hd - hs);
    })
  })
}
Pump.prototype.calcNPSHa = function(){
  // TODO

}


class Pipe{
  constructor(name){
    this.name = name;
    this.type = 'pipe';
    this.roughness = 0.00009144;
    this.flow = 0;
    this.flow_sf = 0;
    this.fittings = {};
    this.length = 0;
    this.matl = '316';
    this.nps = null;
    this.sch = null;
    this.source = null;
    this.target = null;
    this.innerDiameter = null;
    this.connectionTo = [];
    this.connectionFrom = [];
    this.sg = null;
  }
}

Pipe.prototype.setFlow = function(){
  this.flow_sf = this.flow * system.sf;
}

Pipe.prototype.calcInnerDiameter = function(npsTable){

  // get the inner diameter of the pipe in meters
  // I guess this isn't so much of a calculation as it is just retrieving the data from the table.  The nps table was originally a listing of pipe thicknesses so a calculation used to make sense.
  if(this.nps && this.sch){
    this.innerDiameter = npsTable[this.nps][this.sch] / 1000;
  }
  console.log(this.innerDiameter)
  return this.innerDiameter;
}

var system = new System();



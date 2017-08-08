class Agent {
  constructor(w){
    this.id;
    this.dna;
  	this.state = {};
    this.behaviors = [];
  }

  setDna(dna){
      this.dna = dna;
  }

  setState(key, value){
      this.state[key] = value;
  }

  addBehavior(behavior){
      // check for instanceof behavior
      this.behaviors.push(behavior);
  }

  removeBehavior(removed){
      this.behaviors.filter(behavior => {
         return behavior !== removed;
      });
  }

  update(world){
    this.behaviors.forEach(behavior => {
        behavior(this, world);
    });
  }
}

export default Agent;

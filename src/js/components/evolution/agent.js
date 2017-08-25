class Agent {
  constructor(){
    this.id;
    this.dna;
    this.traits = {};
  	this.state = {};
    this.behaviors = [];
  }

  setDNA(dna){
      this.dna = dna;
      this.dna.genes.forEach(gene => {
          this.traits[gene.key] = gene.express(gene.value);
      });
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
        behavior.run(this, world);
    });
  }
}

export default Agent;

class World {
  constructor(options){
    this.options = options || {};
    this.agents = [];
    this.width = this.options.width || 1920;
    this.height = this.options.height || 1080;
    this.fps = this.options.fps || 20;
    this.idCounter = 0;
  }

  init(){
    this.agents = [];

    console.log('Evolution world initialized!');
    console.log(`World size is [${this.width},${this.height}], started with ${seedSize} agents.`);
  }

  clearAgents(){
    this.agents = [];
  }

  addAgent(agent){
    agent.id = this.idCounter;
    this.agents.push(agent);
    this.idCounter ++;
  }

  update(){
    this.agents.forEach(agent => {
      agent.update(this);
    });
  }
}

export default World;

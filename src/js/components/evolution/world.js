class World {
  constructor(options){
    this.options = options || {};
    this.agents = [];
    this.agentIndex = {};
    this.width = this.options.width || 1920;
    this.height = this.options.height || 1080;
    this.fps = this.options.fps || 20;
    this.idCounter = 0;
  }

  init(){
    this.clearAgents();

    console.log('Evolution world initialized!');
    console.log(`World size is [${this.width},${this.height}], started with ${seedSize} agents.`);
  }

  clearAgents(){
    this.agents = [];
    this.agentIndex = {};
  }

  addAgent(agent){
    agent.id = this.idCounter;
    this.agents.push(agent);
    this.agentIndex[agent.id] = agent;
    this.idCounter ++;
  }

  getAgentById(id){
    return this.agentIndex[id];
  }

  removeAgentById(id){
    this.agents = this.agents.filter(agent => {
      return agent.id !== id;
    })
    delete this.agentIndex[id];
  }

  update(){
    this.agents.forEach(agent => {
      agent.update(this);
    });
  }
}

export default World;

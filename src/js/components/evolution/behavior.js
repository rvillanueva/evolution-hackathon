class Behavior {
    constructor(functionToRun){
        this.functionToRun = functionToRun;
    }
    run(agent, world){
        return this.functionToRun(agent, world);
    }
}

export default Behavior;

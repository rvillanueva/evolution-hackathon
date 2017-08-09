class Behavior {
    constructor(functionToRun){
        if(typeof functionToRun !== 'function'){
            throw new Error('Behavior must be initialized with a function.');
        }
        this.functionToRun = functionToRun;
    }
    run(agent, world){
        return this.functionToRun(agent, world);
    }
}

export default Behavior;

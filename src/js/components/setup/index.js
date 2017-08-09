import { Agent, Behavior } from '../evolution';
import * as behaviors from './behaviors';
import p5 from 'p5';
var p = new p5();

var sheepBehaviors = [
    //new Behavior(behaviors.alignWithAgents),
    //new Behavior(behaviors.groupWithAgents),
    new Behavior(behaviors.separateFromAgents),
    new Behavior(behaviors.stopAtBorders),
    new Behavior(behaviors.bounce),
    new Behavior(behaviors.applyAcceleration),
    new Behavior(behaviors.applyVelocity)
];

var wolfBehaviors = [
    //new Behavior(behaviors.alignWithAgents),
    //new Behavior(behaviors.groupWithAgents),
    new Behavior(behaviors.separateFromAgents),
    new Behavior(behaviors.stopAtBorders),
    new Behavior(behaviors.bounce),
    new Behavior(behaviors.applyAcceleration),
    new Behavior(behaviors.applyVelocity)
];


export function setupWorld(world){
    for(let i = 0; i < 50; i++){
        var sheep = setupAgent();
        sheep.type = 'sheep';
        for(let j = 0; j < sheepBehaviors.length; j++){
            sheep.addBehavior(sheepBehaviors[j]);
        }
        world.addAgent(sheep);
    }
    for(let i = 0; i < 2; i++){
        var wolf = setupAgent();
        wolf.type = 'wolf';
        for(let j = 0; j < wolfBehaviors.length; j++){
            wolf.addBehavior(wolfBehaviors[j]);
        }
        world.addAgent(wolf);
    }
    function setupAgent(){
        var agent = new Agent();
        agent.state.position = createVector(Math.floor(Math.random() * world.width), Math.floor(Math.random() * world.height));
        agent.state.velocity = createVector(Math.random() * 10, Math.random() * 10);
        agent.state.acceleration = createVector(0,0);
        return agent;
    }

}

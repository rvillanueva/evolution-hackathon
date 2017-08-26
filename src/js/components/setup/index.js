import {Agent, DNA, Gene} from '../evolution';
import p5 from 'p5';
import AgentModel from './model';

var p = new p5();
const math = require('mathjs');

export function setupWorld(world) {
    world.setupAgent = setupAgent;

    for (let i = 0; i < 50; i++) {
        let dna = new DNA(AgentModel.genes);
        dna.randomize();
        let agent = world.setupAgent(dna);
        world.addAgent(agent);
    }


    function setupAgent(dna) {
        var config = AgentModel;
        var agent = new Agent();
        agent.type = config.type;
        AgentModel.perceptrons.map(perceptron => {
            AgentModel.effects.map(effect => {
                dna.setGene(new Gene(`weight_${perceptron.key}_${effect.key}`, Math.random(), (val) => { return val; }));
            });
        });
        agent.setDNA(dna);
        for (let j = 0; j < config.behaviors.length; j++) {
            agent.addBehavior(config.behaviors[j]);
        }
        agent.state.position = createVector(Math.floor(Math.random() * world.width), Math.floor(Math.random() * world.height));
        agent.state.velocity = createVector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        agent.state.acceleration = createVector(0, 0);
        agent.state.energy = 100;
        agent.state.kills = 0;
        var arr1 = [];
        AgentModel.perceptrons.map(perceptron => {
            var arr2 = [];
            AgentModel.effects.map(effect => {
                arr2.push(agent.dna.getGene(`weight_${perceptron.key}_${effect.key}`).value);
            });
            arr1.push(arr2);
        });
        agent.weights = math.matrix(arr1);
        return agent;
    }

}

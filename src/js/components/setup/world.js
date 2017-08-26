import {Agent, DNA, Gene, World} from '../evolution';
import AgentModel from './model';
import config from '../../config';
import math from 'mathjs';

class MyWorld extends World {
    constructor(props){
        super(props);
        this.markers = [];
    }
    setupAgent(dna) {
        var config = AgentModel;
        var agent = new Agent();
        agent.type = config.type;
        agent.setDNA(dna);
        for (let j = 0; j < config.behaviors.length; j++) {
            agent.addBehavior(config.behaviors[j]);
        }
        agent.state.position = createVector(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
        agent.state.velocity = createVector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        agent.state.acceleration = createVector(0, 0);
        agent.state.energy = 100 + (Math.random() - 0.5) * 2 * 50;
        agent.state.kills = 0;
        var arr1 = [];
        AgentModel.perceptrons.map(perceptron => {
            var arr2 = [];
            AgentModel.effects.map(effect => {
                arr2.push(agent.dna.getGene(`weight_${effect.key}_${perceptron.key}`).value);
            });
            arr1.push(arr2);
        });
        agent.weights = math.matrix(arr1);

        var geneArr = [];
        agent.dna.genes.map(gene => {
            geneArr.push(gene.value);
        });
        agent.geneMatrix = math.matrix(geneArr);

        agent.kinships = {};
        return agent;
    }

    createRandomAgent(){
		let dna = new DNA(AgentModel.genes);
		dna.randomize();
		AgentModel.perceptrons.map(perceptron => {
			AgentModel.effects.map(effect => {
				dna.setGene(new Gene(`weight_${effect.key}_${perceptron.key}`, Math.random(), (val) => {
					return val;
				}));
			});
		});
		let agent = this.setupAgent(dna);
		this.addAgent(agent);
	}
    addMarker(marker, duration) {
        marker.frames = duration * config.fps;
		this.markers.push(marker);
	};
}

module.exports = MyWorld;

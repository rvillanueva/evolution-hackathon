import config from '../../config';
const math = require('mathjs');

export function perceive(perceptrons, effects) {
	return function(agent, world) {
        if(agent.perceived && agent.perceived.agents && config.refreshSkipFrames && world.frame % config.refreshSkipFrames !== 0){
            return;
        }
		agent.perceived = {
			agents: []
		};
		world.agents.forEach(a => {
            var distance = agent.state.position.dist(a.state.position);
			if (a.id == agent.id || distance > (agent.traits.vision + agent.state.width/2)) {
				return;
			}
			var pushed = {
				id: a.id,
				agent: a,
                distance: distance,
				effects: {}
			};
			var layer_1 = [];
			perceptrons.map(perceptron => {
				layer_1.push(perceptron.input(agent, pushed));
			});
			var outputs = math.multiply([layer_1], agent.weights);
			effects.map((effect, e) => {
                var output = math.subset(outputs, math.index(0, e));
				pushed.effects[effect.key] = output/layer_1.length;
			});
			agent.perceived.agents.push(pushed);
		});
	};
}

export function applyEffects(){
	return function(agent, world){
		agent.perceived.agents.map(p => {
			var force = agent.state.position.copy().sub(p.agent.state.position);
            force.normalize();
			force.mult((p.effects.attraction - 0.5));
            force.mult(agent.traits.attractionSensitivity);
			agent.state.acceleration.add(force);
		});
	};
}

export function spread(){
	return function(agent, world){
		var overlapping = agent.perceived.agents.filter(p => {
            return p.distance < (agent.state.width + p.agent.state.width)/2;
		});
        if(overlapping.length > 2){
            var center = createVector();
            var overlappingEnergy = 0;
            overlapping.map(p => {
                overlappingEnergy += p.agent.state.energy;
                center.add(p.agent.state.position);
            });
            center.div(overlapping.length);
            var force = center.sub(agent.state.position);
            force.normalize();
            force.mult(-100 * overlappingEnergy/agent.state.energy);
            agent.state.acceleration.add(force);
        }
	};
}


export function calculateKinships(){
	return function(agent, world){
		agent.perceived.agents.map(p => {
            if(!agent.kinships[p.id]){
                agent.kinships[p.id] = 1 - math.abs(math.mean(math.subtract(agent.geneMatrix, p.agent.geneMatrix)));
            }
		});
	};
}

export function consumeEnergy(){
	return function(agent, world){
        var change = 0;
        change -= Math.pow(agent.state.energy, 1.2) * 0.005/config.fps;
        change -= agent.traits.maxSpeed * 0.005/config.fps;
	    agent.state.energy += change;
        agent.state.energyChange = change * config.fps;
    };
}

export function bounce(){
	return function(agent, world){
		var position = agent.state.position;
		var margin = agent.state.width/2 + 10;
		if(position.x > (world.width - margin)){
			agent.state.position.x = world.width - margin;
			agent.state.velocity.x = agent.state.velocity.x * -1;
		} else if(position.x < margin){
			agent.state.position.x = margin;
			agent.state.velocity.x = agent.state.velocity.x * -1;
		};
		if(position.y > (world.height - margin)){
			agent.state.position.y = world.height - margin;
			agent.state.velocity.y = agent.state.velocity.y * -1;
		} else if(position.y < margin){
			agent.state.position.y = margin;
			agent.state.velocity.y = agent.state.velocity.y * -1;
		};
	};
}

export function wrap(){
	return function(agent, world){
		var position = agent.state.position;
		if(position.x > (world.width + agent.state.width/2)){
			agent.state.position.x = -agent.state.width;
		};
		if(position.x < -agent.state.width/2){
			agent.state.position.x = world.width + agent.state.width/2;
		};
		if(position.y > (world.height + agent.state.height/2)){
			agent.state.position.y = -agent.state.height/2;
		};
		if(position.y < -agent.state.height/2){
			agent.state.position.y = world.height + agent.state.height/2;
		};
	};
}

export function applyAcceleration(){
	return function(agent, world){
		agent.state.acceleration.limit(agent.traits.maxAccel);
		agent.state.velocity.add(agent.state.acceleration);
	};
}

export function applyVelocity(){
	return function(agent, world){
		agent.state.velocity.limit(agent.traits.maxSpeed);
		agent.state.position.add(agent.state.velocity);
	};
}

export function groupWithAgentsByStatus(status, trait){
	return function(agent, world){
		agent.perceived.agents.forEach(a => {
		  if(a.status == status){
			var force = a.agent.state.position.copy();
			force.normalize();
			force.mult(agent.traits[trait]/a.distance || 1);
			a.forces.vector.add(force);
			a.forces.count ++;
		  }
		});
	};
}

export function alignWithAgents(trait){
	return function(agent, world){
		var sum = createVector(0,0);
		for ( var i = 0; i < world.agents.length; i++){
		  var a = world.agents[i];
		  var dist = a.state.position.dist(agent.state.position);
		  sum.add(a.state.velocity);
		}
		if(world.agents.length > 0){
			sum.div(world.agents.length);
			sum.normalize();
			sum.mult(agent.traits[trait] || 1);
			applySteering(agent, sum, agent.traits.maxSpeed, agent.traits.maxAccel);
		}
	};
}

export function resetAcceleration(){
	return function(agent, world){
		agent.state.acceleration = createVector(0,0);
	};
}

export function avoidEdge(){
	return function(agent, world){
        var margin = 100;
        var mag = agent.traits.edgeAvoidance;
        var force = createVector();
		if(agent.state.position.x > world.width - margin){
            force.add(createVector(-mag, 0));
        } else if(agent.state.position.x < margin){
            force.add(createVector(mag, 0));
        }
        if(agent.state.position.y > world.height - margin){
            force.add(createVector(0, -mag));
        } else if(agent.state.position.y < margin){
            force.add(createVector(0, mag));
        }
        agent.state.acceleration.add(force);
	};
}

export function attack(){
	return function(agent, world){
		agent.perceived.agents.map(a => {
		  var targeted = world.getAgentById(a.id);
		  if (
              targeted && a.distance < (agent.state.width + a.agent.state.width)/2.2 &&
             (a.effects.threat > agent.traits.threatSensitivity || a.vulnerability > agent.traits.vulnerabilitySensitivity)
          ) {
              var energy = agent.state.energy * 0.05;
              a.agent.state.energy -= energy;
              if(a.agent.traits.foodchain < agent.traits.foodchain * 0.9){
                  agent.state.energy += energy * 0.8;
              };
              //console.log(`Agent${agent.id} attacked Agent${a.id} for ${Math.floor(energy * 100)/100} energy`);
              if(a.agent.state.energy < 0){
                  console.log(`Agent${agent.id} killed Agent${a.id}.`);
                  killAgentById(targeted.id, world);
                  agent.state.kills = agent.state.kills || 0;
                  agent.state.kills ++;
              }
		  };
      });
	};
}

export function reproduceWithNearbyAgents(){
	return function(agent, world){
		agent.perceived.agents.map(a => {
		  if(a.distance < (agent.state.width + a.agent.state.width)/2 && Math.random() < agent.traits.reproductionRate && world.agents.length < 75){
			console.log(`${agent.id} reproduced with ${a.id}`);
            var cost = agent.traits.offspringSize * agent.state.energy;
			var newDNA = agent.dna.reproduce(a.agent.dna);
			var newAgent = world.setupAgent(newDNA);
			newAgent.state.position = agent.state.position.copy();
            var newVelocity = createVector();
            newVelocity.add(agent.state.velocity, a.agent.state.velocity);
            newVelocity.mult(0.5);
            newAgent.state.velocity = newVelocity;
            newAgent.state.energy = cost * 0.8;
            agent.state.energy -= cost * 1.2;
			world.addAgent(newAgent);
		  }
      });
	};
}

export function setAppearance(){
	return function(agent, world){
	  agent.state.width = 8 + Math.pow(agent.state.energy, 0.6) * 2;
	  agent.state.height = 8 + Math.pow(agent.state.energy, 0.6) * 2;
	};
}

export function applyAttractionPerceptrons(){
	return function(agent, world){
	  var sum = createVector();
	  agent.perceived.agents.map(a => {
		sum.add(a.effects.attraction);
	  });
	  sum.normalize();
	  sum.mult(agent.traits.maxAccel);
	  agent.state.acceleration.add(sum);
	};
}

export function dieIfNoEnergy(){
	return function(agent, world){
	  if(agent.state.energy < 0){
		killAgentById(agent.id, world);
        console.log(`${agent.id} died from lack of energy.`);
	  }
	};
}

function applyForce(agent, force){
  agent.state.acceleration.add(force);
};

function applySteering(agent, sum, maxSpeed, maxAccel){
	  sum.mult(maxSpeed);
	  var steer = sum.copy();
	  steer.sub(agent.state.velocity);
	  steer.limit(maxAccel);
	  applyForce(agent, steer);
}

function killAgentById(agentId, world){
  world.removeAgentById(agentId);
}

/*

  checkForKill(){
	for (var i = 0; i < this.world.users.length; i++){
	  var user = this.world.users[i];
	  if(this.state.position.distance(user.position) < config.killRadius/2 ){
		this.state.alive = false;
		console.log('Agent killed!');
		return;
	  }
	}
  }

  checkForEdge(){
	var margin = 50;
	var x = this.state.position.getX();
	var y = this.state.position.getY();
	if(x > this.world.width - margin){
	  this.state.position.setX(this.world.width - margin);
	} else if (x < margin){
	  this.state.position.setX(margin);
	}

	if(y > this.world.height - margin){
	  this.state.position.setY(this.world.height - margin);
	} else if (y < margin){
	  this.state.position.setY(margin);
	}
  }

  tryReproducing(){
	var nearbyAgents = this.world.agents.filter(agent => {
	  return this.state.position.distance(agent.state.position) < this.traits.vision;
	})

	var roll = Math.random();
	var k = 1;
	var c = 2;
	if(roll < c/(c*Math.pow(this.world.agents.length, 1.7)) * this.traits.replicationProb){
	  var partner = nearbyAgents[Math.floor(Math.random() * nearbyAgents.length)];
	  var dna = this.dna.reproduce(partner.dna);
	  if(Math.random() < config.randomChance){
		dna.randomize();
	  }
	  var position = {
		x: (this.state.position.getX() + partner.state.position.getX())/2,
		y: (this.state.position.getY() + partner.state.position.getY())/2
	  }
	  this.world.createAgent(new Agent(position, dna, this.world));
	}
  }

  checkHealth(){
	this.state.health -= 1;
	if (this.state.health <= 0){
	  this.state.alive = false;
	}
  }
//alignment
  alignWithAgents(){
	var sum = Vec2D.ObjectVector(0,0);
	var count = 0;
	for ( var i =0; i < this.world.agents.length; i++){
	  var a = this.world.agents[i];
	  var dist = a.state.position.distance(this.state.position);
	  if ((dist > 0) && (dist<this.traits.vision)) {
		sum.add(a.state.velocity);
		count ++;
	  }
	}
	if(count>0){
	  sum.divS(count);
	  sum.normalize();
	  sum.mulS(this.traits.maxSpeed);
	  var steer = sum.clone();
	  steer.subtract(this.state.velocity);
	  steer = this.limit(steer,this.traits.maxAccel);
	  this.applyForce(steer);
	}
  }
//cohesions
  groupWithAgents(){
	var sum = Vec2D.ObjectVector(0,0);
	var count = 0;
	for ( var i =0; i < this.world.agents.length; i++){
	  var a = this.world.agents[i];
	  var dist = a.state.position.distance(this.state.position);
	  if ((dist > 0) && (dist<this.traits.vision)) {
		sum.add(a.state.position);
		count++;
	  }
	}
	if(count>0){
	  sum.divS(count)
	  sum.subtract(this.state.position)
	  sum.normalize()
	  sum.mulS(this.traits.maxSpeed)
	  var steer = sum.clone()
	  steer.subtract(this.state.velocity)
	  steer.mulS(this.traits.attractionToOthers)
	  steer = this.limit(steer,this.traits.maxAccel);
	  this.applyForce(steer);
	}
  }

  //separate
  separateFromAgents(){
	var sum = Vec2D.ObjectVector(0,0)
	var count = 0
	for ( var i =0; i < this.world.agents.length; i++){
	  var a = this.world.agents[i];
	  var dist = a.state.position.distance(this.state.position);
	  if ((dist > 0) && (dist<this.traits.distanceFromOthers)) {
		var diff = this.state.position.clone()
		diff.subtract(a.state.position)
		diff.normalize()
		//diff.mulS(-1)
		diff.divS(dist)
		sum.add(diff)
		count++
	  }
	}
	if(count>0){
	  sum.divS(count)
	  sum.normalize()
	  sum.mulS(this.traits.maxSpeed)
	  var steer = sum.clone()
	  steer.subtract(this.state.velocity)
	  //steer = this.limit(steer,this.traits.maxAccel);
	  //steer.mulS(5)
	  this.applyForce(steer);
	}
  }

  repelUser(){
	var sum = Vec2D.ObjectVector(0,0)
	var steer = Vec2D.ObjectVector(0,0)
	var count = 0
	for (var i = 0; i < this.world.users.length; i++){
	  var user = this.world.users[i];
	  var dist = user.position.distance(this.state.position)
	  if(this.state.position.distance(user.position) < this.traits.vision){
		var diff = this.state.position.clone()
		var dist = diff.magnitude()
		diff.subtract(user.position)
		//diff.mulS(-1)
		diff.normalize()
		diff.divS(dist)
		sum.add(diff)
		count++
	  }
	}
	if(count>0){
	  sum.divS(count)
	  sum.normalize()
	  sum.mulS(this.traits.maxSpeed)
	  var steer = sum.clone()
	  steer.subtract(this.state.velocity)
	  steer.mulS(100)
	  this.applyForce(steer)
	}
  }



// ______HELPER FUNCTIIONS__________




  limit(vec,mag){
	var v = vec;
	if (v.magnitude() > mag){
	  v.unit()
	  vec.mulS(mag)
	}
	return v

  }

  mapper(val,min, max){
	var v = ((max-min)*val)+min
	return v
  }





  /////

  this.checkForKill();
  this.checkForEdge();
  if(this.world.agents.length < config.maxAgents){
	this.tryReproducing();
  }
  this.alignWithAgents();
  this.groupWithAgents();
  this.separateFromAgents();
  this.repelUser();
  this.state.acceleration = this.limit(this.state.acceleration,this.traits.maxAccel)
  this.state.velocity.add(this.state.acceleration)
  this.state.velocity = this.limit(this.state.velocity,this.traits.maxSpeed)
  this.state.position.add(this.state.velocity)
  this.state.acceleration.mulS(0)
  */

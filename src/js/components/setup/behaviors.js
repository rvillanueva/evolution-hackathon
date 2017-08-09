export function bounce(){
    return function(agent, world){
        var position = agent.state.position;
        var margin = 5;
        if(position.x > (world.width - margin)){
            agent.state.position.x = world.width - margin;
            agent.state.velocity.x = agent.state.velocity.x * -1;
        };
        if(position.x < margin){
            agent.state.position.x = margin;
            agent.state.velocity.x = agent.state.velocity.x * -1;
        };
        if(position.y > (world.height - margin)){
            agent.state.position.y = world.height - margin;
            agent.state.velocity.y = agent.state.velocity.y * -1;
        };
        if(position.y < margin){
            agent.state.position.y = margin;
            agent.state.velocity.y = agent.state.velocity.y * -1;
        };
    };
}

export function applyVelocity(){
    return function(agent, world){
        agent.state.velocity.limit(agent.traits.maxSpeed);
        agent.state.position.add(agent.state.velocity);
    };
}

export function applyAcceleration(){
    return function(agent, world){
        agent.state.acceleration.limit(agent.traits.maxAccel);
        agent.state.position.add(agent.state.acceleration);
    };
}

export function groupWithAgentsByType(type, trait){
    return function(agent, world){
        var sum = createVector(0, 0);
        var count = 0;
        var agents = world.agents.filter(a => {
            var dist = a.state.position.dist(agent.state.position);
            return dist > 0 && dist < agent.traits.vision && a.type == type;
        });
        for (var i = 0; i < agents.length; i++) {
            var a = agents[i];
            var dist = a.state.position.dist(agent.state.position);
            sum.add(a.state.position);
        }
        if(count > 0){
            sum.div(agents.length);
            sum.normalize();
            sum.mult(agent.traits[trait] || 1);
            applySteering(agent, sum, agent.traits.maxSpeed, agent.traits.maxAccel);
        }
    };
}

export function separateFromAgentsByType(type, trait){
    return function(agent, world){
        var sum = createVector(0,0);
        var agents = world.agents.filter(a => {
            var dist = a.state.position.dist(agent.state.position);
            return dist > 0 && dist < agent.traits.vision && a.type == type;
        });
        for (var i = 0; i < agents.length; i++){
            var a = agents[i];
            var diff = agent.state.position.copy();
            var dist = a.state.position.dist(agent.state.position);
            diff.sub(a.state.position);
            diff.normalize();
            diff.div(dist);
            sum.add(diff);
        }
        if(agents.length > 0){
            sum.div(agents.length);
            sum.normalize();
            sum.mult(agent.traits[trait] || 1);
            applySteering(agent, sum, agent.traits.maxSpeed, agent.traits.maxAccel);
        }

    };
}

export function alignWithAgentsByType(type, trait){
    return function(agent, world){
        var sum = createVector(0,0);
        var agents = world.agents.filter(a => {
            var dist = a.state.position.dist(agent.state.position);
            return dist > 0 && dist < agent.traits.vision && a.type == type;
        });
        for ( var i = 0; i < agents.length; i++){
          var a = agents[i];
          var dist = a.state.position.dist(agent.state.position);
          sum.add(a.state.velocity);
        }
        if(agents.length > 0){
            sum.div(agents.length);
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

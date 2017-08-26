import { Behavior } from '../evolution';
import * as behaviors from './behaviors';

function normalize(x, min, max){
    var ans;
  if(x < max){
    ans = (x - min)/(max - min);
  } else {
    ans = (x - max - min)/(max - min) + Math.log(x - max + 1);
  }
  return ans;
}

var genes = [
    {
        key: 'maxSpeed',
        express: function(val){
            return val * 3 + 0.5;
        }
    }, {
        key: 'maxAccel',
        express: function(val){
            return val * 0.5 + 0.1;
        }
    },
    {
        key: 'vision',
        express: function(val){
            return val * 400;
        }
    },
    {
        key: 'color-h',
        express: function(val){
            return Math.floor(val * 360);
        }
    },
    {
        key: 'color-s',
        express: function(val){
            return Math.floor(val * 40+20);
        }
    },
    {
        key: 'color-l',
        express: function(val){
            return Math.floor(val * 30 + 50);
        }
    },
    {
        key: 'killRange',
        express: function(val){
            return val * 20;
        }
    },
    {
        key: 'reproductionRate',
        express: function(val){
            return val * 0.001;
        }
    },
    {
        key: 'foodchain',
        express: function(val){
            return val;
        }
    },
    {
        key: 'attractionSensitivity',
        express: function(val){
            return val * 100;
        }
    }
];

var perceptrons = [{
  key: 'distance',
  input: (agent, p) => {
    return normalize(p.agent.state.position.dist(agent.state.position), 0, 10);
  }
},
{
  key: 'kills',
  input: (agent, p) => {
    return normalize(p.agent.state.kills, 0, 50);
  }
}];

var effects = [{
  key: 'attraction',
  output: val => {
    return val * 100;
  }
}];

var modelBehaviors = [
  new Behavior(behaviors.wrap()),
  new Behavior(behaviors.adjustEnergy()),
  new Behavior(behaviors.perceive(perceptrons, effects)),
  new Behavior(behaviors.resetAcceleration()),
  new Behavior(behaviors.applyEffects()),
  new Behavior(behaviors.reproduceWithNearbyAgents()),
  new Behavior(behaviors.killNearbyAgents()),
  new Behavior(behaviors.setAppearance()),
  new Behavior(behaviors.applyAcceleration()),
  new Behavior(behaviors.applyVelocity()),
  new Behavior(behaviors.dieIfNoEnergy())
];

module.exports = {
    type: 'base',
    genes: genes,
    behaviors: modelBehaviors,
    perceptrons: perceptrons,
    effects: effects
};

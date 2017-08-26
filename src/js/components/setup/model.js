import { Behavior } from '../evolution';
import * as behaviors from './behaviors';

function normalize(x, min, max){
    x = Math.min(x, min);
    x = Math.max(x, max);
    return (x - min)/(max - min);
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
            return val * 300;
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
        key: 'killRange',
        express: function(val){
            return val * 20;
        }
    },
    {
        key: 'reproductionRate',
        express: function(val){
            return val * 0.05;
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
    },
    {
        key: 'offspringSize',
        express: function(val){
            return val * 0.4;
        }
    },
    {
        key: 'kinshipThreshold',
        express: function(val){
            return val * 0.2 + 0.8;
        }
    },
    {
        key: 'edgeAvoidance',
        express: function(val){
            return val * 10;
        }
    }
];

var perceptrons = [
{
  key: 'kills',
  input: (agent, p) => {
    return normalize(p.agent.state.kills, 0, 50);
  }
},
{
  key: 'foodchain',
  input: (agent, p) => {
    return p.agent.traits.foodchain;
  }
},
{
  key: 'otherEnergy',
  input: (agent, p) => {
    return normalize(p.agent.state.energy, 0, 1000);
  }
},
{
  key: 'ownEnergy',
  input: (agent, p) => {
    return normalize(agent.state.energy, 0, 1000);
  }
},
{
  key: 'kinship',
  input: (agent, p) => {
      if(agent.kinships[p.id]){
          return normalize(agent.kinships[p.id], 0, 1);
      } else {
          return 0;
      }
  }
}];

var effects = [{
  key: 'attraction',
  output: val => {
    return val * 100;
  }
}];

var modelBehaviors = [
  new Behavior(behaviors.bounce()),
  new Behavior(behaviors.resetAcceleration()),
  new Behavior(behaviors.consumeEnergy()),
  new Behavior(behaviors.perceive(perceptrons, effects)),
  new Behavior(behaviors.calculateKinships()),
  new Behavior(behaviors.applyEffects()),
  new Behavior(behaviors.spread()),
  new Behavior(behaviors.avoidEdge()),
  new Behavior(behaviors.reproduceWithNearbyAgents()),
  new Behavior(behaviors.eatAdjacentAgents()),
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

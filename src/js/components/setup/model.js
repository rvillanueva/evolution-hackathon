import { Behavior } from '../evolution';
import * as behaviors from './behaviors';

function normalize(x, min, max){
  if(x < max){
    return (x - min)/(max - min);
  } else {
    return (x - max - min)/(max - min) + Math.log(max - x + 1);
  }
}


module.exports = {
    type: 'base',
    genes: [
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
            key: 'seekFriends',
            express: function(val){
                return val * 400;
            }
        },
        {
            key: 'seekEnemies',
            express: function(val){
                return val * 100;
            }
        },
        {
            key: 'fleeEnemies',
            express: function(val){
                return val * 4000;
            }
        },
        {
            key: 'fleeFriends',
            express: function(val){
                return val * 100;
            }
        },
        {
            key: 'aggression',
            express: function(val){
                return val;
            }
        },
        {
            key: 'vengefulness',
            express: function(val){
                return val;
            }
        },
        {
            key: 'fear',
            express: function(val){
                return val * 100;
            }
        }
    ],
    behaviors: [
      new Behavior(behaviors.wrap()),
      new Behavior(behaviors.getEnergy()),
      new Behavior(behaviors.perceive()),
      new Behavior(behaviors.resetAcceleration()),
      new Behavior(behaviors.labelPerceivedAgents()),
      new Behavior(behaviors.applyEffects(),
      new Behavior(behaviors.reproduceWithNearbyAgents()),
      new Behavior(behaviors.killNearbyAgents()),
      new Behavior(behaviors.setAppearance()),
      new Behavior(behaviors.applyForces()),
      new Behavior(behaviors.applyAcceleration()),
      new Behavior(behaviors.applyVelocity()),
      new Behavior(behaviors.dieIfDead())
    ],
    perceptrons: [{
      key: 'distance',
      input: (agent, p) => {
        return normalize(p.state.position.dist(agent.state.position), 0, 10)
      }
    },
    {
      key: 'kills',
      input: (agent, p) => {
        return normalize(p.agent.state.kills, 0, 50)
      }
    }],
    effects: [{
      key: 'attraction',
      output: val => {
        return val * 100;
      }
    },
    {
      key: 'threat',
      output: val => {
        return val * 100;
      }
    },
    {
      key: 'weakness',
      output: val => {
        return val * 100;
      }
    },
    {
      key: 'weakness',
      output: val => {
        return val * 100;
      }
    }]
};

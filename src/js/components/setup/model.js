import { Behavior } from '../evolution';
import * as behaviors from './behaviors';

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
                return val * 2 + 0.1;
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
                return val * 10;
            }
        },
        {
            key: 'seekEnemies',
            express: function(val){
                return val * 10;
            }
        },
        {
            key: 'fleeEnemies',
            express: function(val){
                return val * 10;
            }
        },
        {
            key: 'fleeFriends',
            express: function(val){
                return val * 10;
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
        }
    ],
    behaviors: [
      new Behavior(behaviors.wrap()),
      new Behavior(behaviors.getEnergy()),
      new Behavior(behaviors.perceive()),
      new Behavior(behaviors.labelPerceivedAgents()),
      new Behavior(behaviors.resetAcceleration()),
      new Behavior(behaviors.groupWithAgentsByStatus('friend', 'seekFriends')),
      new Behavior(behaviors.groupWithAgentsByStatus('enemy', 'seekEnemies')),
      new Behavior(behaviors.separateFromAgentsByStatus('friend', 'fleeFriends')),
      new Behavior(behaviors.separateFromAgentsByStatus('enemy', 'fleeEnemies')),
      //new Behavior(behaviors.alignWithAgents()),
      new Behavior(behaviors.reproduceWithNearbyAgents()),
      new Behavior(behaviors.killNearbyAgents()),
      new Behavior(behaviors.setAppearance()),
      new Behavior(behaviors.applyAcceleration()),
      new Behavior(behaviors.applyVelocity()),
      new Behavior(behaviors.dieIfDead())
    ]
};

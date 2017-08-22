import { Behavior } from '../evolution';
import * as behaviors from './behaviors';

export const sheep = {
    type: 'sheep',
    genes: [
        {
            key: 'maxSpeed',
            express: function(val){
                return val * 2 + 0.5;
            }
        }, {
            key: 'maxAccel',
            express: function(val){
                return val * 1 + 0.1;
            }
        },
        {
            key: 'separateFromFriends',
            express: function(val){
                return val * 2;
            }
        },
        {
            key: 'separateFromEnemies',
            express: function(val){
                return val * 4;
            }
        },
        {
            key: 'vision',
            express: function(val){
                return val * 500;
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
                return Math.floor(val * 60);
            }
        },
        {
            key: 'color-l',
            express: function(val){
                return Math.floor(val * 30 + 60);
            }
        }
    ],
    behaviors: [
        new Behavior(behaviors.resetAcceleration()),
        //new Behavior(behaviors.alignWithAgentsByType('sheep')),
        //new Behavior(behaviors.groupWithAgentsByType('sheep')),
        //new Behavior(behaviors.separateFromAgentsByType('sheep', 'separateFromFriends')),
        new Behavior(behaviors.separateFromAgentsByType('wolf', 'separateFromEnemies')),
        new Behavior(behaviors.bounce()),
        new Behavior(behaviors.applyAcceleration()),
        new Behavior(behaviors.applyVelocity())
    ]
};

export const wolf = {
    type: 'wolf',
    genes: [
        {
            key: 'maxSpeed',
            express: function(val){
                return val * 2 + 1;
            }
        }, {
            key: 'maxAccel',
            express: function(val){
                return val * 6 + 0.1;
            }
        },
        {
            key: 'vision',
            express: function(val){
                return val * 100 + 1;
            }
        }
    ],
    behaviors: [
        new Behavior(behaviors.resetAcceleration()),
        new Behavior(behaviors.groupWithAgentsByType('sheep')),
        new Behavior(behaviors.separateFromAgentsByType('wolf')),
        new Behavior(behaviors.bounce()),
        new Behavior(behaviors.applyAcceleration()),
        new Behavior(behaviors.applyVelocity())
    ]
};

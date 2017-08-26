import p5 from 'p5';

var p = new p5();

export function setupWorld(world) {
	for (let i = 0; i < 50; i++) {
		world.createRandomAgent();
	}
}

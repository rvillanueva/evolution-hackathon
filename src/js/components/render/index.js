export function drawAgent(p, agent){
    p.fill(150);
    p.ellipse(agent.state.position.x, agent.state.position.y, 20, 20);
};

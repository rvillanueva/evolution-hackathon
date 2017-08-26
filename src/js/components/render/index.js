export function drawAgent(p, agent){
    p.fill(`hsl(${agent.traits['color-h']},${agent.traits['color-s']}%,${Math.max(90 - agent.state.kills, 20)}%)`);
    p.ellipse(agent.state.position.x, agent.state.position.y, agent.state.width, agent.state.height);
};

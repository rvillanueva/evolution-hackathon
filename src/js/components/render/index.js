export function drawAgent(p, agent){
    p.fill(`hsl(${agent.traits['color-h']},${agent.traits['color-s']}%,${agent.traits['color-l']}%)`);
    p.ellipse(agent.state.position.x, agent.state.position.y, agent.state.width, agent.state.height);
};

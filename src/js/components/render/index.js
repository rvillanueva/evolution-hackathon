export function drawAgent(p, agent){
    if(agent.type === 'sheep'){
        p.fill(`hsl(${agent.traits['color-h']},${agent.traits['color-s']}%,${agent.traits['color-l']}%)`);
        p.ellipse(agent.state.position.x, agent.state.position.y, 20, 20);
    } else if(agent.type === 'wolf') {
        p.fill(`rgb(255, 0, 0)`);
        p.ellipse(agent.state.position.x, agent.state.position.y, 40, 40);
    }
};

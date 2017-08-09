export function drawAgent(p, agent){
    if(agent.type === 'sheep'){
        p.fill(150);
        p.ellipse(agent.state.position.x, agent.state.position.y, 20, 20);
    } else {
        p.fill(200);
        p.ellipse(agent.state.position.x, agent.state.position.y, 40, 40);
    }
};

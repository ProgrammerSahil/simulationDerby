import Matter from "matter-js";

const spawnSmallBox = (x, y, color, Matter) => {

  let smallBox = Matter.Bodies.rectangle(x, y, 8, 8, {
    friction: 5,
    frictionStatic: 3.0,
    density: 0.08, 
    showDebug: false,
    restitution:0,
    render: {
      fillStyle: color,
    },
  });
  return smallBox;
};



const spawnSmallBall = (x, y, color, Matter) => {
    let smallBall = Matter.Bodies.circle(x, y, 30, {
      restitution: 0.01,
      density:0.1,
      friction:0,
      
        render: {
            fillStyle: color,
        }
    });

    Matter.Body.setVelocity(smallBall, {x:40, y:-1});

    return smallBall;
}

export { spawnSmallBox, spawnSmallBall };

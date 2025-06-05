import Matter from "matter-js";

const spawnSmallBox = (x, y, color, Matter, engine) => {
  let smallBox = Matter.Bodies.rectangle(x, y, 20, 20, {
    restitution: 0,
    friction: 0.9,
    frictionStatic: 1,
    density: 0.005,
    render: {
      fillStyle: color,
    },
  });
  Matter.Composite.add(engine.world, [smallBox]);
};

const spawnSmallBall = (x, y, color, Matter, engine) => {
    let smallBall = Matter.Bodies.circle(x, y, 30, {
        render: {
            fillStyle: color,
        }
    });

    //Matter.Body.setVelocity(smallBall, { x: 5, y: 5 });

    Matter.Composite.add(engine.world, [smallBall]);
}

export { spawnSmallBox, spawnSmallBall };

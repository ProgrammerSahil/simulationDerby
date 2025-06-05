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

export { spawnSmallBox };

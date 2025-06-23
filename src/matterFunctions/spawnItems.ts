import Matter from "matter-js";

const createSmallBox = (x: number, y: number, color: string, matter: typeof Matter) => {
  const smallBox = matter.Bodies.rectangle(x, y, 8, 8, {
    friction: 5,
    frictionStatic: 3.0,
    density: 0.08,
    restitution: 0,
    render: {
      fillStyle: color,
    },
  });
  return smallBox;
};

const createSmallCannonBall = (x: number, y: number, color: string, matter: typeof Matter) => {
  const smallBall = matter.Bodies.circle(x, y, 10, {
    restitution: 0.1,
    density: 0.1,
    friction: 0,
    render: {
      fillStyle: color,
    }
  });
  Matter.Body.setVelocity(smallBall, { x: 80, y: 0 });
  return smallBall;
};

const createBreakablePlatform = (worldHeight: any, x: number) => {
  const boxes = [];
      for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
          if (i < 20 || j < (100 - i) / 2 || j >= (100 - i) / 2 + i) continue;
          boxes.push(createSmallBox(x + 550 - j * 8, worldHeight - 320 + i * 8, "black", Matter));
        }
      }
  
      return boxes;
}

export { createSmallBox, createSmallCannonBall, createBreakablePlatform };
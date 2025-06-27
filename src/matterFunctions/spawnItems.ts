import Matter, { Composite } from "matter-js";

const createSmallBox = (x: number, y: number, color: string, matter: typeof Matter) => {
  const smallBox = matter.Bodies.rectangle(x, y, 8, 8, {
    friction: 5,
    frictionStatic: 3.0,
    density: 1,
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

const createRigidBall = (x: number, y:number, color:string, matter: typeof Matter) => {
  const rigidBall = matter.Bodies.circle(x, y, 50, {
    restitution: 0.1,
    density: 0.5, 
    friction: 0.2,
    render: {
      fillStyle: color
    }
  })

  return rigidBall;
}

const createExplotion = (x:number, y: number, matter: typeof Matter, world: Matter.World, blastRadius:number) => {
  const allBodies = matter.Composite.allBodies(world);
  allBodies.forEach(body => {
    const dx = body.position.x - x;
    const dy = body.position.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < blastRadius && distance > 0) {
      const force = 0.06 * (200 - distance) / distance;
      Matter.Body.applyForce(body, body.position, {
        x: dx * force,
        y: dy * force
      });
    }
  });
}

const createRigidbox = (x: number, y: number, color: string, matter: typeof Matter) => {
  const rigidBox = matter.Bodies.rectangle(x, y, 80, 80, {
    density: 0.1,
    friction: 1,
    restitution: 0.2,
    render: {
      fillStyle: color
    }
  });
  return rigidBox;
}

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

export { createSmallBox, createSmallCannonBall, createBreakablePlatform, createRigidbox, createRigidBall, createExplotion };
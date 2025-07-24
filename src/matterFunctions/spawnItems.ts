import Matter from "matter-js";

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

const createRigidBall = (x: number, y: number,radius: number, color: string, matter: typeof Matter) => {
  const rigidBall = matter.Bodies.circle(x, y, radius, {
    restitution: 0.1,
    density: 0.5,
    friction: 0.2,
    render: {
      fillStyle: color
    }
  })
  return rigidBall;
}

const explodedBombs = new Set<number>();

const createBomb = (x: number, y: number, matter: typeof Matter) => {
  const bomb = matter.Bodies.circle(x, y, 10, {
    label: "bomb",
    render: {
      fillStyle: "black"
    }
  });
  return bomb;
}

const createExplotion = (x: number, y: number, matter: typeof Matter, world: Matter.World, blastRadius: number, impact: number) => {
  const allBodies = matter.Composite.allBodies(world);
  console.log("explosion at: "+x+"and" + y);
  
  let bodiesAffected = 0;
  
  allBodies.forEach(body => {
    if (body.isStatic) return;
    
    const dx = body.position.x - x;
    const dy = body.position.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < blastRadius && distance > 0) {
      bodiesAffected++;
      const forceMagnitude = impact * (blastRadius - distance) / blastRadius;
      const velocityX = (dx / distance) * forceMagnitude * 0.1;
      const velocityY = (dy / distance) * forceMagnitude * 0.1;
      
      console.log(`Setting velocity for body at distance ${distance}: vx=${velocityX}, vy=${velocityY}`);
      
      Matter.Body.setVelocity(body, {
        x: body.velocity.x + velocityX,
        y: body.velocity.y + velocityY
      });
    }
  });
  
  console.log(`Total bodies affected: ${bodiesAffected}`);
}

const createRigidbox = (x: number, y: number, size:number, color: string, matter: typeof Matter) => {
  const rigidBox = matter.Bodies.rectangle(x, y, size, size, {
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
  for (let i = 0; i < 60; i++) {
    for (let j = 0; j < 60; j++) {
      if (i < 20 || j < (60 - i) / 2 || j >= (60 - i) / 2 + i) continue;
      boxes.push(createSmallBox(x + 550 - j * 8, worldHeight - 320 + i * 8,  "black", Matter));
    }
  }
  return boxes;
}

export { createSmallBox, createBomb, createSmallCannonBall, createBreakablePlatform, createRigidbox, createRigidBall, createExplotion, explodedBombs };
import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./App.css";
import {
  createSmallCannonBall,
  createBreakablePlatform,
  createRigidbox,
  createRigidBall,
  createExplotion,
  createBomb,
  explodedBombs
} from "./matterFunctions/spawnItems.ts";

function App() {
  const containerRef = useRef(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const rendererRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const spawnIntervalRef = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const selectedToolRef = useRef("cannonballs");

  const [selectedTool, setSelectedTool] = useState("cannonballs");
  const ballRadiusRef = useRef(50);
  const boxSizeRef = useRef(50);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value);
    ballRadiusRef.current = newRadius;
  }

  const handleBoxSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    boxSizeRef.current = newSize;
  }

  const handleToolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedToolRef.current = e.target.value;
    setSelectedTool(e.target.value);
    
    const ballRange = document.getElementById("ballRange")!;
    const boxRange = document.getElementById("boxRange")!;
    
    if(selectedToolRef.current === "rigidBall"){
      ballRange.style.visibility="visible"
      ballRange.style.height="auto"
      boxRange.style.visibility="hidden"
      boxRange.style.height="0"
    } else if(selectedToolRef.current === "rigidBox"){
      ballRange.style.visibility="hidden"
      ballRange.style.height="0"
      boxRange.style.visibility="visible"
      boxRange.style.height="auto"
    } else {
      ballRange.style.visibility="hidden"
      ballRange.style.height="0"
      boxRange.style.visibility="hidden"
      boxRange.style.height="0"
    }
  };

  // Helper function to get responsive dimensions
  const getCanvasDimensions = () => {
    const isMobile = window.innerWidth <= 768;
    const worldWidth = isMobile ? window.innerWidth : window.innerWidth - 200;
    const worldHeight = isMobile ? window.innerHeight - 240 : window.innerHeight - 90; // Account for options at bottom on mobile
    return { worldWidth, worldHeight };
  };

  useEffect(() => {
    if (containerRef.current && !engineRef.current) {
      const { worldWidth, worldHeight } = getCanvasDimensions();

      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1 },
      });
      const renderer = Matter.Render.create({
        element: containerRef.current,
        engine: engine,
        options: {
          width: worldWidth,
          height: worldHeight,
          background: "#87CEEB",
          wireframes: false,
        },
      });
      const runner = Matter.Runner.create();

      const ground = Matter.Bodies.rectangle(
        worldWidth / 2,
        worldHeight,
        worldWidth + 100, // Make ground wider than screen
        10,
        {
          isStatic: true,
          render: { fillStyle: "#7BB369" },
        }
      );

      Matter.Composite.add(engine.world, [ground]);

      Matter.Runner.run(runner, engine);
      Matter.Render.run(renderer);

      engineRef.current = engine;
      rendererRef.current = renderer;
      runnerRef.current = runner;

      const spawnCannonBall = (x: number, y: number) => {
        const ball = createSmallCannonBall(x - 100, y, "#43464b", Matter);
        Matter.Composite.add(engine.world, ball);
      };

      const spawnBomb = (x: number, y: number) => {
        const bomb = createBomb(x, y, Matter);
        Matter.Composite.add(engine.world, bomb);
      };

      const spawnBreakablePlatform = (x: number) => {
        const boxes = createBreakablePlatform(worldHeight, x);
        Matter.Composite.add(engine.world, boxes);
      };

      const spawnRigidBox = (x: number, y: number) => {
        const rigidBox = createRigidbox(x, y, boxSizeRef.current, "#43464b", Matter);
        Matter.Composite.add(engine.world, rigidBox);
      };

      const spawnRigidBall = (x: number, y: number) => {
        const rigidBall = createRigidBall(x, y, ballRadiusRef.current , "#43464b", Matter);
        Matter.Composite.add(engine.world, rigidBall);
      };

      const handleClick = (event: MouseEvent) => {
        const rect = renderer.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (selectedToolRef.current === "breakablePlatform") {
          spawnBreakablePlatform(x);
        } else if (selectedToolRef.current === "rigidBox") {
          spawnRigidBox(x, y);
        } else if (selectedToolRef.current === "rigidBall") {
          spawnRigidBall(x, y);
        } else if (selectedToolRef.current === "explosion") {
          createExplotion(x, y, Matter, engine.world, 200, 300);
        }else if (selectedToolRef.current === "bomb") {
          spawnBomb(x, y);
        }
      };

      const handleMouseMove = (event: MouseEvent) => {
        const rect = renderer.canvas.getBoundingClientRect();
        mousePos.current.x = event.clientX - rect.left;
        mousePos.current.y = event.clientY - rect.top;
      };

      const handleMousePress = (event: MouseEvent) => {
        if (selectedToolRef.current !== "cannonballs") return;

        if (event.type === "mousedown") {
          const rect = renderer.canvas.getBoundingClientRect();
          mousePos.current.x = event.clientX - rect.left;
          mousePos.current.y = event.clientY - rect.top;

          spawnIntervalRef.current = window.setInterval(() => {
            spawnCannonBall(mousePos.current.x, mousePos.current.y);
          }, 80);
        } else if (event.type === "mouseup" && spawnIntervalRef.current) {
          clearInterval(spawnIntervalRef.current);
          spawnIntervalRef.current = null;
        }
      };

      const handleCollision = (
        event: Matter.IEventCollision<Matter.Engine>
      ) => {
        const bombIntensity = 500;
        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;

          if (bodyA.label === "bomb" && !explodedBombs.has(bodyA.id)) {
            explodedBombs.add(bodyA.id);
            createExplotion(bodyA.position.x, bodyA.position.y, Matter, engine.world, 200, bombIntensity);
            setTimeout(() => {
              Matter.Composite.remove(engine.world, bodyA);
              explodedBombs.delete(bodyA.id);
            }, 10);
          } else if (bodyB.label === "bomb" && !explodedBombs.has(bodyB.id)) {
            explodedBombs.add(bodyB.id);
            createExplotion(bodyB.position.x, bodyB.position.y, Matter, engine.world, 200, bombIntensity);
            setTimeout(() => {
              Matter.Composite.remove(engine.world, bodyB);
              explodedBombs.delete(bodyB.id);
            }, 10);
          }
        });
      };

      // Handle window resize
      const handleResize = () => {
        const { worldWidth: newWidth, worldHeight: newHeight } = getCanvasDimensions();
        
        if (renderer && renderer.canvas) {
          renderer.canvas.width = newWidth;
          renderer.canvas.height = newHeight;
          renderer.options.width = newWidth;
          renderer.options.height = newHeight;
          
          // Update ground position
          const ground = engine.world.bodies.find(body => body.render.fillStyle === "#7BB369");
          if (ground) {
            Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight });
          }
        }
      };
      
      const canvas = renderer.canvas;
      canvas.addEventListener("click", handleClick);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mousedown", handleMousePress);
      canvas.addEventListener("mouseup", handleMousePress);
      window.addEventListener("resize", handleResize);
      Matter.Events.on(engine, "collisionStart", handleCollision);

      return () => {
        if (spawnIntervalRef.current) {
          clearInterval(spawnIntervalRef.current);
        }

        Matter.Render.stop(renderer);
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
        Matter.World.clear(engine.world, false);
        Matter.Events.off(engine, "collisionStart", handleCollision);

        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mousedown", handleMousePress);
        canvas.removeEventListener("mouseup", handleMousePress);
        window.removeEventListener("resize", handleResize);

        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }

        engineRef.current = null;
        rendererRef.current = null;
        runnerRef.current = null;
      };
    }
  }, []);

  return (
    <div>
      <h2 className="simHeading" style={{ textAlign: "center" }}>
        Simulation Derby
      </h2>
      <div className="mainContainer">
        <div ref={containerRef} />
        <div className="optionsContainer">
          <h3>Options</h3>

          <div>
            <h4>Weapons</h4>
            <div>
              <input
                type="radio"
                name="tool"
                id="cannonballs"
                value="cannonballs"
                checked={selectedTool === "cannonballs"}
                onChange={handleToolChange}
              />
              <label htmlFor="cannonballs">Cannonballs</label>
            </div>
            <div>
              <input
                type="radio"
                name="tool"
                id="bomb"
                value="bomb"
                checked={selectedTool === "bomb"}
                onChange={handleToolChange}
              />
              <label htmlFor="bomb">Bomb</label>
            </div>
            <div>
              <input
                type="radio"
                name="tool"
                id="explosion"
                value="explosion"
                checked={selectedTool === "explosion"}
                onChange={handleToolChange}
              />
              <label htmlFor="explosion">Explosion</label>
            </div>
          </div>

          <div>
            <h4>Rigid Bodies</h4>
            <div>
              <input
                type="radio"
                name="tool"
                id="rigidBox"
                value="rigidBox"
                checked={selectedTool === "rigidBox"}
                onChange={handleToolChange}
              />
              <label htmlFor="rigidBox">Rigid Box</label>
              <input 
                type="range" 
                name="rigidBoxSize" 
                min={10} 
                max={100} 
                id="boxRange" 
                onChange={handleBoxSizeChange}  
                style={{visibility:"hidden", height:"0"}} 
              />
            </div>
            <div>
              <input
                type="radio"
                name="tool"
                id="rigidBall"
                value="rigidBall"
                checked={selectedTool === "rigidBall"}
                onChange={handleToolChange}
              />
              <label htmlFor="rigidBall">Rigid Ball</label>
              <input 
                type="range" 
                name="rigidBallRadius" 
                min={10} 
                max={100} 
                id="ballRange" 
                onChange={handleRangeChange}  
                style={{visibility:"hidden", height:"0"}} 
              />
            </div>
          </div>

          <div>
            <h4>Breakable Bodies</h4>
            <div>
              <input
                type="radio"
                name="tool"
                id="breakablePlatform"
                value="breakablePlatform"
                checked={selectedTool === "breakablePlatform"}
                onChange={handleToolChange}
              />
              <label htmlFor="breakablePlatform">Breakable Platform</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
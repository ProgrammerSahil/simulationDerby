import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./App.css";
import { createSmallBox, createSmallCannonBall, createBreakablePlatform } from "./matterFunctions/spawnItems.ts";

function App() {
  const containerRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState("cannonballs");

  useEffect(() => {
    const mousePos = { x: 0, y: 0 };
    let spawnInterval: number | null = null;

    const updateMousePosition = (event: any) => {
      mousePos.x = event.clientX;
      mousePos.y = event.clientY - 50;
    };

    const spawnCannonBall = (x: number, y: number) => {
      const cannonBall = createSmallCannonBall(x, y, "#43464b", Matter);
      Matter.Composite.add(engine.world, cannonBall);
    };

    const spawnBreakablePlatform = (y:number) => {
      const boxes = createBreakablePlatform(worldHeight, y);
      Matter.Composite.add(engine.world, boxes);
    }

    const spawnSelected = (event: any) => {
      let x = event.clientX;
      let y = event.clientY;
      if(selectedTool==="cannonballs"){
        spawnCannonBall(x, y - 50);
      }
      else if(selectedTool=="breakablePlatform"){
        spawnBreakablePlatform(y);
      }
    };

    const semiAuto = (event: any) => {
      if(selectedTool === "cannonballs"){
      if (event.type === "mousedown") {
        if (spawnInterval) {
          clearInterval(spawnInterval);
        }
        mousePos.x = event.clientX;
        mousePos.y = event.clientY - 50;
        
        spawnInterval = setInterval(() => {
          spawnCannonBall(mousePos.x, mousePos.y);
        }, 80);
      } else if (event.type === "mouseup") {
        if (spawnInterval) {
          clearInterval(spawnInterval);
          spawnInterval = null;
        }
      }
    }
    };

    let worldWidth = window.innerWidth - 200;
    let worldHeight = window.innerHeight - 90;

    let engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 1,
      },
      timing: {
        timeScale: 1,
      },
    });

    let renderer = Matter.Render.create({
      element: containerRef.current!,
      engine: engine,
      options: {
        width: worldWidth,
        height: worldHeight,
        background: "#87CEEB",
        wireframes: false,
        showVelocity: false,
        showAngleIndicator: false,
      },
    });

    let ground = Matter.Bodies.rectangle(
      worldWidth / 2,
      worldHeight,
      window.innerWidth,
      10,
      {
        restitution: 1,
        isStatic: true,
        render: {
          fillStyle: "#7BB369",
        },
      }
    );


    Matter.Composite.add(engine.world, [ground]);
    Matter.Render.run(renderer);

    let runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    renderer.canvas.addEventListener("click", spawnSelected);
    renderer.canvas.addEventListener("mousedown", semiAuto);
    renderer.canvas.addEventListener("mouseup", semiAuto);
    renderer.canvas.addEventListener("mousemove", updateMousePosition);

    return () => {
      if (spawnInterval) {
        clearInterval(spawnInterval);
      }
      Matter.Render.stop(renderer);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      renderer.canvas.removeEventListener("click", spawnSelected);
      renderer.canvas.removeEventListener("mousedown", semiAuto);
      renderer.canvas.removeEventListener("mouseup", semiAuto);
      renderer.canvas.removeEventListener("mousemove", updateMousePosition);
      renderer.canvas.remove();
    };
  }, [selectedTool]);

  return (
    <div>
      <h2 className="simHeading" style={{ textAlign: "center" }}>
        Simulation Derby
      </h2>
      <div className="mainContainer">
        <div ref={containerRef} />
        <div className="optionsContainer">
          <h3>options</h3>
          <div>
            <input 
              type="radio" 
              name="tool" 
              id="cannonballs" 
              value="cannonballs"
              checked={selectedTool === "cannonballs"}
              onChange={(e) => setSelectedTool(e.target.value)}
            />
            <label htmlFor="cannonballs">Cannonballs</label>
          </div>
          <div>
            <input 
              type="radio" 
              name="tool" 
              id="breakablePlatform" 
              value="breakablePlatform"
              checked={selectedTool === "breakablePlatform"}
              onChange={(e) => setSelectedTool(e.target.value)}
            />
            <label htmlFor="breakablePlatform">breakablePlatform</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
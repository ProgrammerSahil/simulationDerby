import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./App.css";
import { spawnSmallBox, spawnSmallBall } from "./matterFunctions/spawnBox.ts";

function App() {
  const containerRef = useRef(null);
  
  useEffect(() => {
     
    const mousePos = { x: 0, y: 0 };
    let isMouseDown = false; 
    
    const updateMousePosition = (event: any) => {
      
      mousePos.x = event.clientX;
      mousePos.y = event.clientY - 50;
    };

    let spawnInterval: number | null = null;

    const spawnSelected = (event: any) => {
      Matter.Composite.add(
        engine.world,
        spawnSmallBall(
          event.clientX,
          event.clientY - 50,
          "#43464b",
          Matter
        )
      );
    };

    const semiAuto = (event: any) => {
      if (event.type === "mousedown") {
        isMouseDown = true;
        
        if (spawnInterval) {
          clearInterval(spawnInterval);
        }
        
        mousePos.x = event.clientX;
        mousePos.y = event.clientY - 50;
        
        spawnInterval = setInterval(() => {
          Matter.Composite.add(
            engine.world,
            spawnSmallBall(
              mousePos.x, 
              mousePos.y,
              "#43464b",
              Matter
            )
          );
        }, 80);
      } else if (event.type === "mouseup") {
        isMouseDown = false;
        
        if (spawnInterval) {
          clearInterval(spawnInterval);
          spawnInterval = null;
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
    
    const boxes = [];
    for (let i = 0; i < 150; i++) {
      for (let j = 0; j < 150; j++) {
        if (i < 20 || j < (100 - i) / 2 || j >= (100 - i) / 2 + i) continue;
        boxes.push(spawnSmallBox(worldWidth - 100 - j * 8, worldHeight - 320 + i * 8, "black", Matter));
      }
    }
    
    Matter.Composite.add(engine.world, boxes);
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
  }, []);

  return (
    <div>
      <h2 className="simHeading" style={{ textAlign: "center" }}>
        Simulation Derby
      </h2>
      <div className="mainContainer">
        <div ref={containerRef} />
        <div className="optionsContainer">
          <h3>options</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
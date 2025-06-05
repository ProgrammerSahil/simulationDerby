import { useEffect, useRef } from "react";
import Matter from "matter-js";
import './App.css'
import {spawnSmallBox} from "./matterFunctions/spawnBox.js"

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    let engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 1,
      },
    });

    
    let renderer = Matter.Render.create({
      element: containerRef.current!,
      engine: engine,
      options: {
        width: 1000,        
        height: 600,       
        background: '#87CEEB', 
        wireframes: false, 
        showVelocity: false,
        showAngleIndicator: false,
      }
    });

    
    for(let i=0; i<15; i++){
      for(let j=0; j<15; j++){
        spawnSmallBox(200+j*20, 250+i*20,"#ff6b6b", Matter, engine);
      }
    }

    let ground = Matter.Bodies.rectangle(500, 600, 1000, 10, {
      isStatic:true,
      render: {
        fillStyle: '#7BB369',
      }
    })

    

    Matter.Composite.add(engine.world, [ground]);
    Matter.Render.run(renderer);

    let runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Cleanup function
    return () => {
      Matter.Render.stop(renderer);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      renderer.canvas.remove();
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2 className="simHeading">Simulation Derby</h2>
      <div 
        ref={containerRef}
        
      />
    </div>
  );
}

export default App;
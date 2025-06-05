import { useEffect, useRef } from "react";
import Matter from "matter-js";
import './App.css'
import {spawnSmallBox, spawnSmallBall} from "./matterFunctions/spawnBox.js"

function App() {
  const containerRef = useRef(null);

  useEffect(() => {

    let worldWidth = window.innerWidth-200;
    let worldHeight = window.innerHeight-90;

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
        width: worldWidth,        
        height: worldHeight,       
        background: '#87CEEB', 
        wireframes: false, 
        showVelocity: false,
        showAngleIndicator: false,
      }
    });


    

    let ground = Matter.Bodies.rectangle(worldWidth/2, worldHeight, window.innerWidth, 5, {
      isStatic:true,
      render: {
        fillStyle: '#7BB369',
      }
    })

    for(let i=0; i<15; i++){
      for(let j=0; j<15; j++){
        spawnSmallBox(300+j*20, 290+i*25,"#ff6b6b", Matter, engine);
      }
    }

    spawnSmallBall(window.innerWidth-500, window.innerHeight-250, "#43464b", Matter, engine);

    

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
  }, [window.innerWidth]);

  return (
    <div>
      <h2 className="simHeading" style={{"textAlign": "center"}}>Simulation Derby</h2>
      <div className="mainContainer">
      <div 
        ref={containerRef}
        
      />
      <div className="optionsContainer">
        <h3>options</h3>
      </div>
      </div>
    </div>
  );
}

export default App;
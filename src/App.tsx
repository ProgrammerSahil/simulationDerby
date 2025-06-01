import { useEffect, useRef } from "react";
import Matter from "matter-js";

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    let engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0,
      },
    });

    
    let renderer = Matter.Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: 1000,        
        height: 600,       
        background: '#1a1a2e', 
        wireframes: false, 
        showVelocity: false,
        showAngleIndicator: false,
      }
    });

    
    let boxA = Matter.Bodies.rectangle(400, 300, 50, 50, {
      render: {
        fillStyle: '#ff6b6b' 
      }
    });

    

    Matter.Composite.add(engine.world, [boxA]);
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
      <h2>Simulation Derby</h2>
      <div 
        ref={containerRef}
        
      />
    </div>
  );
}

export default App;
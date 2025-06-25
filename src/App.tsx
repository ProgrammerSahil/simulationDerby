import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./App.css";
import {
  createSmallCannonBall,
  createBreakablePlatform,
  createRigidbox,
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

  const handleToolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedToolRef.current = e.target.value;
    setSelectedTool(e.target.value);
  };

  useEffect(() => {
    if (containerRef.current && !engineRef.current) {
      const worldWidth = window.innerWidth - 200;
      const worldHeight = window.innerHeight - 90;

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
        window.innerWidth,
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
        const ball = createSmallCannonBall(x, y, "#43464b", Matter);
        Matter.Composite.add(engine.world, ball);
      };

      const spawnBreakablePlatform = (x: number) => {
        const boxes = createBreakablePlatform(worldHeight, x);
        Matter.Composite.add(engine.world, boxes);
      };

      const spawnRigidBox = (x:number, y:number) => {
        const rigidBox = createRigidbox(x, y, "#43464b", Matter);
        Matter.Composite.add(engine.world, rigidBox);
      }

      const handleClick = (event: MouseEvent) => {
        const x = event.clientX;
        const y = event.clientY;
        if (selectedToolRef.current === "cannonballs") {
          spawnCannonBall(x, y);
        } else if (selectedToolRef.current === "breakablePlatform") {
          spawnBreakablePlatform(x);
        } else if (selectedToolRef.current === "rigidBox"){
          spawnRigidBox(x, y);
        }
      };

      const handleMouseMove = (event: MouseEvent) => {
        mousePos.current.x = event.clientX;
        mousePos.current.y = event.clientY - 50;
      };

      const handleMousePress = (event: MouseEvent) => {
        if (selectedToolRef.current !== "cannonballs") return;

        if (event.type === "mousedown") {
          mousePos.current.x = event.clientX;
          mousePos.current.y = event.clientY - 50;

          spawnIntervalRef.current = window.setInterval(() => {
            spawnCannonBall(mousePos.current.x, mousePos.current.y);
          }, 80);
        } else if (event.type === "mouseup" && spawnIntervalRef.current) {
          clearInterval(spawnIntervalRef.current);
          spawnIntervalRef.current = null;
        }
      };

      const canvas = renderer.canvas;
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mousedown", handleMousePress);
      canvas.addEventListener("mouseup", handleMousePress);

      // Cleanup on unmount
      return () => {
        if (spawnIntervalRef.current) {
          clearInterval(spawnIntervalRef.current);
        }

        Matter.Render.stop(renderer);
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
        Matter.World.clear(engine.world, false);

        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mousedown", handleMousePress);
        canvas.removeEventListener("mouseup", handleMousePress);

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
              id="breakablePlatform"
              value="breakablePlatform"
              checked={selectedTool === "breakablePlatform"}
              onChange={handleToolChange}
            />
            <label htmlFor="breakablePlatform">Breakable Platform</label>
          </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";

const BIRD_SIZE = 20;
const GAME_HEIGHT = 500;
const GAME_WIDTH = 500;
const GRAVITY = 10;
const JUMP_HEIGHT = 50;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_GAP = 150;

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameRunning, setGameRunning] = useState(false);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Gravity Effect
  useEffect(() => {
    let interval = null;
    if (gameRunning && !gameOver) {
      interval = setInterval(() => {
        setBirdPosition((prev) => Math.min(prev + GRAVITY, GAME_HEIGHT - BIRD_SIZE));
      }, 80);
    }
    return () => clearInterval(interval);
  }, [gameRunning, gameOver]);

  // Obstacle Movement
  useEffect(() => {
    let interval = null;
    if (gameRunning && !gameOver) {
      interval = setInterval(() => {
        setObstacleLeft((prev) => {
          if (prev <= 0) {
            setScore((prevScore) => prevScore + 1);
            setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
            return GAME_WIDTH;
          }
          return prev - 5;
        });
      }, 24);
    }
    return () => clearInterval(interval);
  }, [gameRunning, gameOver]);

  // Collision Detection
  useEffect(() => {
    const birdTop = birdPosition;
    const birdBottom = birdPosition + BIRD_SIZE;
    const obstacleTop = obstacleHeight;
    const obstacleBottom = obstacleHeight + OBSTACLE_GAP;

    if (
      obstacleLeft < BIRD_SIZE &&
      obstacleLeft + OBSTACLE_WIDTH > 0 &&
      (birdTop < obstacleTop || birdBottom > obstacleBottom)
    ) {
      setGameOver(true);
      setGameRunning(false);
    }
  }, [birdPosition, obstacleHeight, obstacleLeft]);

  const handleJump = () => {
    if (!gameRunning) {
      setGameRunning(true);
    }
    setBirdPosition((prev) => Math.max(prev - JUMP_HEIGHT, 0));
  };

  const restartGame = () => {
    setGameOver(false);
    setGameRunning(false);
    setBirdPosition(250);
    setObstacleLeft(GAME_WIDTH);
    setObstacleHeight(200);
    setScore(0);
  };

  return (
    <div className="App" onClick={handleJump} style={{ position: "relative", overflow: "hidden" }}>
      {/* Game Area */}
      <div
        style={{
          position: "relative",
          backgroundImage:
            "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7lDMnpApQ2vzQ3_8XEzeigSpIF-z0Si20bA&s)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
        }}
      >
        {/* Bird */}
        <div
          style={{
            position: "absolute",
            width: `${BIRD_SIZE}px`,
            height: `${BIRD_SIZE}px`,
            backgroundImage:
              "url(https://assetsio.gnwcdn.com/flappy_bird.gif?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            top: `${birdPosition}px`,
            left: "50px",
          }}
        />
        {/* Obstacle Top */}
        <div
          style={{
            position: "absolute",
            width: `${OBSTACLE_WIDTH}px`,
            height: `${obstacleHeight}px`,
            backgroundColor: "green",
            top: "0",
            left: `${obstacleLeft}px`,
          }}
        />
        {/* Obstacle Bottom */}
        <div
          style={{
            position: "absolute",
            width: `${OBSTACLE_WIDTH}px`,
            height: `${GAME_HEIGHT - obstacleHeight - OBSTACLE_GAP}px`,
            backgroundColor: "green",
            bottom: "0",
            left: `${obstacleLeft}px`,
          }}
        />
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.7)",
            padding: "20px",
            borderRadius: "10px",
            color: "white",
          }}
        >
          <h1>Game Over</h1>
          <p>Score: {score}</p>
          <button onClick={restartGame} style={{ padding: "10px 20px", fontSize: "18px" }}>
            Restart
          </button>
        </div>
      )}

      {/* Score */}
      {!gameOver && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          Score: {score}
        </div>
      )}
    </div>
  );
}

export default App;

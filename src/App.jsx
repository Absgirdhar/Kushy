import React, { useState, useEffect, useCallback, useRef } from 'react';

const GROUND_HEIGHT = 20;
const DINO_WIDTH = 44;
const DINO_HEIGHT = 47;
const DINO_DUCK_HEIGHT = 30;
const GRAVITY = 0.5;
const JUMP_FORCE = 12;
const INITIAL_SPEED = 2;
const SPEED_INCREMENT = 0.0002;

// Silly T-Rex with googly eyes and goofy features
const DinoSprite = ({ ducking, frame }) => {
  if (ducking) {
    return (
      <svg width="59" height="30" viewBox="0 0 59 30">
        {/* Body */}
        <rect fill="#4CAF50" x="22" y="0" width="37" height="30" rx="5"/>
        {/* Neck */}
        <rect fill="#4CAF50" x="0" y="10" width="22" height="10"/>
        {/* Big googly eye */}
        <circle fill="white" cx="48" cy="10" r="8"/>
        <circle fill="black" cx={frame % 2 === 0 ? "50" : "46"} cy="10" r="4"/>
        <circle fill="white" cx={frame % 2 === 0 ? "51" : "47"} cy="8" r="1.5"/>
        {/* Tongue sticking out */}
        <ellipse fill="#E91E63" cx="5" cy="18" rx="5" ry="3"/>
        {/* Spots */}
        <circle fill="#388E3C" cx="35" cy="15" r="3"/>
        <circle fill="#388E3C" cx="50" cy="22" r="2"/>
        {/* Tiny legs while ducking */}
        {frame % 2 === 0 ? (
          <>
            <rect fill="#4CAF50" x="28" y="30" width="5" height="6" rx="2"/>
            <rect fill="#4CAF50" x="44" y="30" width="5" height="6" rx="2"/>
          </>
        ) : (
          <>
            <rect fill="#4CAF50" x="32" y="30" width="5" height="6" rx="2"/>
            <rect fill="#4CAF50" x="40" y="30" width="5" height="6" rx="2"/>
          </>
        )}
      </svg>
    );
  }

  return (
    <svg width="50" height="55" viewBox="0 0 50 55">
      {/* Body - round and cute */}
      <ellipse fill="#4CAF50" cx="25" cy="35" rx="20" ry="18"/>
      {/* Head */}
      <circle fill="#4CAF50" cx="35" cy="15" r="15"/>
      {/* Big googly eye */}
      <circle fill="white" cx="40" cy="12" r="8"/>
      <circle fill="black" cx={frame % 2 === 0 ? "42" : "38"} cy="12" r="4"/>
      <circle fill="white" cx={frame % 2 === 0 ? "43" : "39"} cy="10" r="1.5"/>
      {/* Big goofy smile */}
      <path d="M 30 22 Q 36 28 44 22" stroke="#388E3C" strokeWidth="2" fill="none"/>
      {/* Two buck teeth */}
      <rect fill="white" x="34" y="22" width="3" height="4" rx="1"/>
      <rect fill="white" x="39" y="22" width="3" height="4" rx="1"/>
      {/* Tongue */}
      <ellipse fill="#E91E63" cx="37" cy="27" rx="3" ry="2"/>
      {/* Tiny arm */}
      <ellipse fill="#4CAF50" cx="8" cy="32" rx="5" ry="3" transform="rotate(-20 8 32)"/>
      {/* Spots on body */}
      <circle fill="#388E3C" cx="18" cy="30" r="3"/>
      <circle fill="#388E3C" cx="30" cy="40" r="2"/>
      <circle fill="#388E3C" cx="15" cy="42" r="2"/>
      {/* Tail */}
      <ellipse fill="#4CAF50" cx="5" cy="38" rx="7" ry="4"/>
      {/* Legs - animated silly walk */}
      {frame % 2 === 0 ? (
        <>
          <rect fill="#4CAF50" x="15" y="50" width="7" height="12" rx="3"/>
          <ellipse fill="#4CAF50" cx="18" cy="62" rx="5" ry="2"/>
          <rect fill="#4CAF50" x="30" y="50" width="7" height="8" rx="3"/>
          <ellipse fill="#4CAF50" cx="33" cy="58" rx="5" ry="2"/>
        </>
      ) : (
        <>
          <rect fill="#4CAF50" x="15" y="50" width="7" height="8" rx="3"/>
          <ellipse fill="#4CAF50" cx="18" cy="58" rx="5" ry="2"/>
          <rect fill="#4CAF50" x="30" y="50" width="7" height="12" rx="3"/>
          <ellipse fill="#4CAF50" cx="33" cy="62" rx="5" ry="2"/>
        </>
      )}
    </svg>
  );
};

// Classic cactus
const Cactus = ({ type }) => {
  if (type === 'small') {
    return (
      <svg width="17" height="30" viewBox="0 0 17 30">
        <rect fill="#535353" x="5" y="0" width="7" height="30"/>
        <rect fill="#535353" x="0" y="8" width="5" height="12"/>
        <rect fill="#535353" x="12" y="12" width="5" height="10"/>
      </svg>
    );
  }
  if (type === 'large') {
    return (
      <svg width="25" height="38" viewBox="0 0 25 38">
        <rect fill="#535353" x="8" y="0" width="9" height="38"/>
        <rect fill="#535353" x="0" y="10" width="8" height="16"/>
        <rect fill="#535353" x="17" y="7" width="8" height="18"/>
      </svg>
    );
  }
  return (
    <svg width="40" height="35" viewBox="0 0 40 35">
      <rect fill="#535353" x="5" y="5" width="7" height="30"/>
      <rect fill="#535353" x="0" y="12" width="5" height="10"/>
      <rect fill="#535353" x="12" y="15" width="5" height="8"/>
      <rect fill="#535353" x="25" y="0" width="9" height="35"/>
      <rect fill="#535353" x="18" y="8" width="7" height="14"/>
      <rect fill="#535353" x="34" y="10" width="6" height="16"/>
    </svg>
  );
};

// Classic bird
const Bird = ({ frame }) => (
  <svg width="46" height="40" viewBox="0 0 46 40">
    <rect fill="#535353" x="15" y="14" width="31" height="12"/>
    <rect fill="#535353" x="0" y="18" width="15" height="6"/>
    {frame % 2 === 0 ? (
      <rect fill="#535353" x="20" y="0" width="8" height="14"/>
    ) : (
      <rect fill="#535353" x="20" y="26" width="8" height="14"/>
    )}
  </svg>
);

// Classic cloud
const Cloud = ({ x, y }) => (
  <svg
    style={{ position: 'absolute', left: `${x}%`, top: y }}
    width="46"
    height="14"
    viewBox="0 0 46 14"
  >
    <rect fill="#f0f0f0" x="0" y="4" width="46" height="6"/>
    <rect fill="#f0f0f0" x="6" y="0" width="10" height="14"/>
    <rect fill="#f0f0f0" x="22" y="2" width="8" height="12"/>
    <rect fill="#f0f0f0" x="34" y="4" width="6" height="10"/>
  </svg>
);

// Classic ground
const Ground = ({ offset }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '200%',
      height: GROUND_HEIGHT,
      transform: `translateX(${-(offset % 100)}%)`,
    }}
  >
    <svg width="100%" height={GROUND_HEIGHT} preserveAspectRatio="none">
      <line x1="0" y1="2" x2="100%" y2="2" stroke="#535353" strokeWidth="2"/>
    </svg>
  </div>
);

export default function DinoGame() {
  const [gameState, setGameState] = useState('waiting');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [isDucking, setIsDucking] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [clouds, setClouds] = useState([
    { id: 1, x: 25, y: 30 },
    { id: 2, x: 62, y: 50 },
    { id: 3, x: 93, y: 20 },
  ]);
  const [groundOffset, setGroundOffset] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [frame, setFrame] = useState(0);
  const [gameWidth, setGameWidth] = useState(800);
  const [gameHeight, setGameHeight] = useState(200);

  const gameLoopRef = useRef(null);
  const lastObstacleRef = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 800);
      const maxHeight = Math.min(window.innerHeight * 0.45, 250);
      setGameWidth(maxWidth);
      setGameHeight(Math.max(maxHeight, 200));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'waiting') {
      setGameState('playing');
      setDinoVelocity(JUMP_FORCE);
      return;
    }
    if (gameState === 'gameOver') {
      setGameState('playing');
      setScore(0);
      setDinoY(0);
      setDinoVelocity(JUMP_FORCE);
      setObstacles([]);
      setSpeed(INITIAL_SPEED);
      lastObstacleRef.current = 0;
      return;
    }
    if (dinoY <= 0) {
      setDinoVelocity(JUMP_FORCE);
    }
  }, [gameState, dinoY]);

  const duck = useCallback((ducking) => {
    if (gameState === 'playing') {
      setIsDucking(ducking);
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        duck(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowDown') {
        duck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump, duck]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();

    if (rect) {
      const touchY = touch.clientY - rect.top;
      if (touchY < rect.height * 0.6) {
        jump();
      } else {
        duck(true);
      }
    }
  }, [jump, duck]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    duck(false);
  }, [duck]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setFrame(f => f + 1);

      setDinoY(y => {
        const newY = y + dinoVelocity;
        return Math.max(0, newY);
      });

      setDinoVelocity(v => {
        if (dinoY <= 0 && v < 0) return 0;
        return v - GRAVITY;
      });

      setGroundOffset(o => o + speed * 0.05);
      setScore(s => s + 1);
      setSpeed(s => Math.min(s + SPEED_INCREMENT, 8));

      setClouds(clouds =>
        clouds.map(cloud => ({
          ...cloud,
          x: cloud.x < -10 ? 110 : cloud.x - speed * 0.04
        }))
      );

      lastObstacleRef.current += speed;
      if (lastObstacleRef.current > 300 + Math.random() * 200) {
        lastObstacleRef.current = 0;
        const types = ['small', 'large', 'double'];
        const type = types[Math.floor(Math.random() * types.length)];
        const isBird = Math.random() > 0.7 && score > 500;

        setObstacles(obs => [...obs, {
          id: Date.now(),
          x: 100,
          type: isBird ? 'bird' : type,
          y: isBird ? (Math.random() > 0.5 ? 22 : 32) : 0
        }]);
      }

      setObstacles(obs =>
        obs
          .map(o => ({ ...o, x: o.x - speed * 0.3 }))
          .filter(o => o.x > -10)
      );

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState, dinoVelocity, dinoY, speed, score]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const dinoLeftPercent = 8;
    const dinoRightPercent = dinoLeftPercent + (isDucking ? 7 : 5);
    const dinoBottom = GROUND_HEIGHT + dinoY;
    const dinoTop = dinoBottom + (isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT);

    for (const obstacle of obstacles) {
      let obsLeftPercent = obstacle.x;
      let obsRightPercent, obsBottom, obsTop;

      if (obstacle.type === 'small') {
        obsRightPercent = obstacle.x + 2;
        obsBottom = GROUND_HEIGHT;
        obsTop = obsBottom + 30;
      } else if (obstacle.type === 'large') {
        obsRightPercent = obstacle.x + 3;
        obsBottom = GROUND_HEIGHT;
        obsTop = obsBottom + 38;
      } else if (obstacle.type === 'double') {
        obsRightPercent = obstacle.x + 5;
        obsBottom = GROUND_HEIGHT;
        obsTop = obsBottom + 35;
      } else if (obstacle.type === 'bird') {
        obsRightPercent = obstacle.x + 6;
        obsBottom = GROUND_HEIGHT + obstacle.y;
        obsTop = obsBottom + 40;
      }

      const padding = 1;
      if (
        dinoRightPercent - padding > obsLeftPercent + padding &&
        dinoLeftPercent + padding < obsRightPercent - padding &&
        dinoTop - 5 > obsBottom + 5 &&
        dinoBottom + 5 < obsTop - 5
      ) {
        setGameState('gameOver');
        setHighScore(h => Math.max(h, Math.floor(score / 10)));
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
  }, [gameState, dinoY, obstacles, isDucking, score]);

  const displayScore = String(Math.floor(score / 10)).padStart(5, '0');
  const displayHighScore = String(highScore).padStart(5, '0');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-2 sm:p-4 select-none">
      <h1 className="text-xl sm:text-4xl font-bold text-gray-800 mb-1">T-Rex Dinosaur</h1>
      <p className="text-gray-500 mb-1 text-xs sm:text-sm">Created by Kush Girdhar</p>
      <p className="text-gray-600 mb-2 sm:mb-4 text-center text-xs sm:text-base px-2">
        <span className="hidden sm:inline">Press Space to jump, down arrow to duck.</span>
        <span className="sm:hidden">Tap top to jump, bottom to duck.</span>
      </p>

      <div
        ref={containerRef}
        className="relative bg-white overflow-hidden cursor-pointer touch-none"
        style={{ width: gameWidth, height: gameHeight }}
        onClick={jump}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 font-mono text-xs sm:text-xl text-gray-700 z-10">
          <span className="text-gray-400 mr-2 sm:mr-4">HI {displayHighScore}</span>
          <span>{displayScore}</span>
        </div>

        {clouds.map(cloud => (
          <Cloud key={cloud.id} x={cloud.x} y={cloud.y * (gameHeight / 200)} />
        ))}

        <div
          style={{
            position: 'absolute',
            left: '8%',
            bottom: GROUND_HEIGHT + dinoY,
            transform: `scale(${Math.max(0.8, Math.min(1, gameWidth / 600))})`,
            transformOrigin: 'bottom left'
          }}
        >
          <DinoSprite ducking={isDucking} frame={frame} />
        </div>

        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            style={{
              position: 'absolute',
              left: `${obstacle.x}%`,
              bottom: obstacle.type === 'bird' ? obstacle.y + GROUND_HEIGHT : GROUND_HEIGHT,
              transform: `scale(${Math.max(0.8, Math.min(1, gameWidth / 600))})`,
              transformOrigin: 'bottom left'
            }}
          >
            {obstacle.type === 'bird' ? (
              <Bird frame={frame} />
            ) : (
              <Cactus type={obstacle.type} />
            )}
          </div>
        ))}

        <Ground offset={groundOffset} />

        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex flex-col sm:hidden pointer-events-none">
            <div className="flex-[3] flex items-center justify-center border-b border-dashed border-gray-300">
              <span className="text-gray-400 text-sm">Tap to Jump ↑</span>
            </div>
            <div className="flex-[2] flex items-center justify-center">
              <span className="text-gray-400 text-sm">Tap to Duck ↓</span>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
            <div className="text-lg sm:text-3xl font-mono tracking-widest text-gray-700 mb-4">
              G A M E &nbsp; O V E R
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                jump();
              }}
              className="p-3 border-2 border-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#535353" strokeWidth="2">
                <path d="M3 12a9 9 0 1 1 9 9"/>
                <path d="M3 12V3"/>
                <path d="M3 12H12"/>
              </svg>
            </button>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="absolute inset-0 items-center justify-center pointer-events-none hidden sm:flex">
            <p className="text-xl text-gray-500 animate-pulse">Press Space or Click to Start</p>
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
        <p className="hidden sm:block">
          Controls: <kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd> / <kbd className="px-2 py-1 bg-gray-200 rounded">↑</kbd> to jump, <kbd className="px-2 py-1 bg-gray-200 rounded">↓</kbd> to duck
        </p>
        <p className="sm:hidden text-gray-400">Tap upper area to jump • Tap lower area to duck</p>
      </div>
    </div>
  );
}

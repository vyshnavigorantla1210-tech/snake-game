import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from './constants';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 's':
        case 'arrowdown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'a':
        case 'arrowleft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'd':
        case 'arrowright':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const CELL_SIZE = 24;

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative border-4 border-[#1a1a1a] bg-black overflow-hidden"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          backgroundImage: `
            linear-gradient(to right, #111 1px, transparent 1px),
            linear-gradient(to bottom, #111 1px, transparent 1px)
          `,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
        }}
      >
        {/* Snake Body */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className="absolute bg-neon-green rounded-[2px]"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              boxShadow: '0 0 8px #39FF14',
              zIndex: i === 0 ? 10 : 5
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [0.6, 0.8, 0.6] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-neon-pink rounded-full"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            boxShadow: '0 0 12px #FF007F',
            transform: 'scale(0.7)'
          }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
            >
              <h2 className="font-display text-neon-pink text-4xl mb-8 uppercase tracking-tighter">GAME OVER</h2>
              <button
                onClick={resetGame}
                className="font-display text-xs border border-white/50 text-white px-8 py-4 hover:bg-white hover:text-black transition-all uppercase tracking-widest"
              >
                RESTART_CORE
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && score === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-40"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="font-display text-xs border border-neon-green text-neon-green px-8 py-4 hover:bg-neon-green hover:text-black transition-all uppercase tracking-widest"
              >
                INITIALIZE_SYSTEM
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import SnakeGame from './SnakeGame';
import MusicPlayer from './MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="h-screen w-full flex flex-col bg-bg text-white font-body overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b-2 border-neon-cyan flex items-center justify-between px-10 bg-gradient-to-r from-[#0a0a0a] to-bg">
        <div className="font-display text-3xl tracking-tighter uppercase text-neon-cyan drop-shadow-[0_0_10px_#00F3FF]">
          SNAKE//WAVE
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-[10px] uppercase text-text-dim tracking-[2px]">Current Session</span>
          <span className="font-display text-5xl text-neon-green drop-shadow-[0_0_15px_#39FF14] leading-none">
            {score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: true })}
          </span>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 grid grid-cols-[300px_1fr_300px] gap-[2px] bg-[#222]">
        {/* Music Sidebar */}
        <aside className="bg-bg p-7.5 flex flex-col overflow-y-auto">
          <h2 className="font-display text-2xl mb-5 uppercase text-neon-pink">AUDIO FEED</h2>
          <MusicPlayer />
        </aside>

        {/* Center Game Viewport */}
        <section className="bg-black flex items-center justify-center relative">
          <SnakeGame onScoreChange={setScore} />
        </section>

        {/* Stats Sidebar */}
        <aside className="bg-bg p-7.5 flex flex-col overflow-y-auto">
          <div className="text-[10px] color-text-dim uppercase tracking-[2px] mb-10">GLOBAL_LEADERBOARD</div>
          
          <div className="flex flex-col gap-3">
            {[
              { rank: '01', name: 'CYBER_PUNK', score: '12,050' },
              { rank: '02', name: 'NULL_VOID', score: '09,820' },
              { rank: '03', name: 'BIT_CRUSH', score: '08,100' },
              { rank: '04', name: 'NEON_VINE', score: '07,550' }
            ].map((entry) => (
              <div key={entry.rank} className="flex justify-between text-sm">
                <span className="font-display text-xs text-neon-cyan">{entry.rank} {entry.name}</span>
                <span className="text-text-dim">{entry.score}</span>
              </div>
            ))}
          </div>

          <div className="mt-15 border border-dashed border-text-dim p-4 text-[11px] text-text-dim leading-relaxed">
            [W][A][S][D] TO NAVIGATE<br />
            [SPACE] TO PAUSE GAME<br />
            [M] TO MUTE AUDIO FEED<br />
            COLLECT PINK NODES TO ASCEND
          </div>
        </aside>
      </main>
    </div>
  );
}

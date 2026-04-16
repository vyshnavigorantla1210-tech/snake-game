import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRACKS } from './constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <ul className="flex flex-col">
        {DUMMY_TRACKS.map((track, index) => (
          <li 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`py-4 border-b border-[#1a1a1a] flex flex-col gap-1 cursor-pointer transition-all ${
              index === currentTrackIndex ? 'border-l-3 border-neon-cyan pl-4' : ''
            }`}
          >
            <span className={`text-sm font-semibold ${index === currentTrackIndex ? 'text-neon-cyan' : 'text-white'}`}>
              {track.title}
            </span>
            <span className="text-[11px] text-text-dim uppercase">
              {track.artist}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-5">
        <div className="h-1 bg-[#1a1a1a] w-full relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_10px_#00F3FF]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={prevTrack}
            className="border border-text-dim text-white px-4 py-2 uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
          >
            PREV
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-bg flex items-center justify-center font-bold hover:scale-105 transition-all"
          >
            {isPlaying ? '||' : '▶'}
          </button>

          <button
            onClick={nextTrack}
            className="border border-text-dim text-white px-4 py-2 uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

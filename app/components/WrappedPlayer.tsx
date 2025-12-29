import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, Share2, Play, Pause, RotateCcw, Github, Flame, Trophy, Calendar, Clock, Moon, Sun, Coffee, Laptop } from "lucide-react";
import type { WrappedData } from "../types";

const IntroScene = ({ data }: { data: WrappedData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8 bg-github-canvas-default text-github-fg-default">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="relative"
    >
      <img
        src={data.profile.avatar_url}
        alt={data.profile.login}
        className="w-32 h-32 rounded-full border-2 border-github-border-default shadow-xl"
      />
      <div className="absolute bottom-0 right-0 bg-github-success-emphasis p-2 rounded-full border-2 border-github-canvas-default">
        <Github className="w-6 h-6 text-white" />
      </div>
    </motion.div>
    
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-3xl font-semibold text-github-fg-default mb-1">@{data.profile.login}</h2>
      <p className="text-xl text-github-fg-muted">{data.profile.name}</p>
    </motion.div>
    
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-lg text-github-fg-muted mt-8 border-t border-github-border-default pt-8 w-full max-w-xs mx-auto"
    >
      <p>GitHub Wrapped {data.year}</p>
    </motion.div>
  </div>
);

const StatsScene = ({ data }: { data: WrappedData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8 bg-github-canvas-default text-github-fg-default">
    <h2 className="text-2xl font-semibold mb-4 text-github-fg-default">{data.year} Wrapped</h2>
    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
      {[
        { label: "Commits", value: data.totalCommits, icon: Github },
        { label: "Stars", value: data.totalStars, icon: Trophy },
        { label: "Streak", value: `${data.longestStreak} Days`, icon: Flame },
        { label: "Rank", value: data.universalRank, icon: Calendar },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-github-canvas-subtle rounded-md p-6 border border-github-border-default shadow-sm flex flex-col items-center justify-center aspect-square"
        >
          <stat.icon className="w-8 h-8 text-github-fg-muted mb-3 opacity-50" />
          <div className="text-2xl font-bold text-github-accent-fg mb-1">{stat.value}</div>
          <div className="text-sm text-github-fg-muted">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ProductiveMonthScene = ({ data }: { data: WrappedData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8 bg-github-canvas-default text-github-fg-default">
    <h2 className="text-2xl font-semibold text-github-fg-default">Most Productive Month</h2>
    
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-github-canvas-subtle p-10 rounded-full border border-github-border-default shadow-xl w-48 h-48 flex flex-col items-center justify-center relative"
    >
       <Calendar className="w-20 h-20 text-github-accent-fg opacity-80" />
       <div className="absolute -bottom-4 bg-github-success-emphasis text-white px-4 py-1 rounded-full text-sm font-bold border border-github-canvas-default">
         {data.mostProductiveMonth.count} Commits
       </div>
    </motion.div>

    <div className="space-y-2">
      <motion.h3 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-github-fg-default"
      >
        {data.mostProductiveMonth.name}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-github-fg-muted"
      >
        You were on fire!
      </motion.p>
    </div>
  </div>
);

const LanguagesScene = ({ data }: { data: WrappedData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8 bg-github-canvas-default text-github-fg-default">
    <h2 className="text-2xl font-semibold mb-4 text-github-fg-default">Top Languages</h2>
    <div className="space-y-3 w-full max-w-sm">
      {data.topLanguages.map((lang, i) => (
        <motion.div
          key={lang.name}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-github-canvas-subtle border border-github-border-default rounded-md p-3 relative overflow-hidden"
        >
          <div className="flex justify-between items-center relative z-10">
            <span className="font-medium text-github-fg-default">{lang.name}</span>
            <span className="text-github-fg-muted text-sm">{lang.percentage.toFixed(1)}%</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${lang.percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-0 left-0 h-1 bg-github-success-emphasis"
          />
        </motion.div>
      ))}
    </div>
  </div>
);

const PersonalityScene = ({ data }: { data: WrappedData }) => {
  const getIcon = () => {
    switch (data.busiestTime) {
      case "Night Owl": return <Moon className="w-24 h-24 text-github-accent-fg" />;
      case "Early Bird": return <Sun className="w-24 h-24 text-github-attention-fg" />;
      case "Lunchtime Coder": return <Coffee className="w-24 h-24 text-github-danger-fg" />;
      default: return <Laptop className="w-24 h-24 text-github-fg-default" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8 bg-github-canvas-default text-github-fg-default">
      <h2 className="text-2xl font-semibold text-github-fg-default">Coding Persona</h2>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-github-canvas-subtle p-10 rounded-full border border-github-border-default shadow-xl w-48 h-48 flex flex-col items-center justify-center"
      >
        {getIcon()}
      </motion.div>

      <div className="space-y-2">
        <motion.h3 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-github-accent-fg"
        >
          {data.busiestTime}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-github-fg-muted"
        >
          Most active on <span className="text-github-fg-default font-medium">{data.busiestDay}s</span>
        </motion.p>
      </div>
    </div>
  );
};

const SummaryScene = ({ data }: { data: WrappedData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8 bg-github-canvas-default text-github-fg-default">
    
    <div className="w-full max-w-sm bg-github-canvas-subtle border border-github-border-default rounded-lg overflow-hidden shadow-lg">
      <div className="p-4 border-b border-github-border-default flex items-center gap-3">
        <img src={data.profile.avatar_url} className="w-10 h-10 rounded-full border border-github-border-default" alt="" />
        <div className="text-left">
          <div className="font-bold text-github-fg-default text-sm">@{data.profile.login}</div>
          <div className="text-xs text-github-fg-muted">GitHub Wrapped {data.year}</div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-2 text-left">
        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Top Language</div>
          <div className="text-sm font-semibold text-github-fg-default truncate">{data.topLanguages[0]?.name || "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Total Commits</div>
          <div className="text-sm font-semibold text-github-fg-default">{data.totalCommits}</div>
        </div>
        
        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Longest Streak</div>
          <div className="text-sm font-semibold text-github-fg-default">{data.longestStreak} Days</div>
        </div>
        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Global Rank</div>
          <div className="text-sm font-semibold text-github-fg-default">{data.universalRank}</div>
        </div>

        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Peak Month</div>
          <div className="text-sm font-semibold text-github-fg-default">{data.mostProductiveMonth.name}</div>
          <div className="text-[10px] text-github-fg-muted">{data.mostProductiveMonth.count} commits</div>
        </div>
        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Persona</div>
          <div className="text-sm font-semibold text-github-fg-default">{data.busiestTime}</div>
        </div>

        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Total Stars</div>
          <div className="text-sm font-semibold text-github-fg-default">{data.totalStars}</div>
        </div>
        <div>
          <div className="text-xs text-github-fg-muted mb-0.5">Repositories</div>
          <div className="text-sm font-semibold text-github-fg-default">{data.profile.public_repos}</div>
        </div>
      </div>
    </div>
  </div>
);

export function WrappedPlayer({ data }: { data: WrappedData }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sceneRef = useRef<HTMLDivElement>(null);

  const scenes = [
    { component: IntroScene, duration: 5000 },
    { component: StatsScene, duration: 6000 },
    { component: ProductiveMonthScene, duration: 6000 },
    { component: LanguagesScene, duration: 6000 },
    { component: PersonalityScene, duration: 6000 },
    { component: SummaryScene, duration: 10000 },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const handleExport = async () => {
    if (sceneRef.current) {
      try {
        const dataUrl = await toPng(sceneRef.current, { cacheBust: true });
        const link = document.createElement("a");
        link.download = `github-wrapped-${data.profile.login}-${currentScene}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to export image", err);
      }
    }
  };

  const CurrentComponent = scenes[currentScene].component;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-github-canvas-inset p-4 font-sans">
      {/* Player Container */}
      <div className="relative w-full max-w-md aspect-[9/16] bg-github-canvas-default rounded-xl overflow-hidden shadow-2xl border border-github-border-default">
        
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
          {scenes.map((_, i) => (
            <div 
              key={i} 
              className="h-1 flex-1 bg-github-border-default rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                setCurrentScene(i);
                setIsPlaying(true);
              }}
            >
              <motion.div
                key={`${i}-${i === currentScene}`}
                initial={{ width: "0%" }}
                animate={{ width: i < currentScene ? "100%" : i === currentScene ? "100%" : "0%" }}
                transition={{ duration: i === currentScene ? scenes[i].duration / 1000 : 0, ease: "linear" }}
                className="h-full bg-github-success-emphasis"
              />
            </div>
          ))}
        </div>

        {/* Scene Content */}
        <div ref={sceneRef} className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <CurrentComponent data={data} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-gradient-to-t from-github-canvas-default to-transparent">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-md hover:bg-github-canvas-subtle text-github-fg-default transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentScene(0)}
              className="p-2 rounded-md hover:bg-github-canvas-subtle text-github-fg-default transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-md hover:bg-github-canvas-subtle text-github-fg-default transition-colors"
              title="Save Image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

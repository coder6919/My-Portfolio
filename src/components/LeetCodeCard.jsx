import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Trophy, Target } from "lucide-react";

// Update these with your real stats as a baseline in case the API ever fails again
const FALLBACK_DATA = {
  totalSolved: 250,
  totalQuestions: 3300,
  easySolved: 120,
  totalEasy: 800,
  mediumSolved: 100,
  totalMedium: 1600,
  hardSolved: 30,
  totalHard: 700,
  ranking: 150000,
  acceptanceRate: 58.5,
};

const LeetCodeCard = ({ username = "SyedSaifuddin" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Updated to the Faisal Shohag Vercel API
        const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
        
        if (!response.ok) throw new Error("API Offline");

        const result = await response.json();

        
        // The Faisal Shohag API returns stats directly in the root object
        if (result && result.totalSolved !== undefined) {
          setData(result);
          setIsLive(true);
        } else {
          throw new Error("Invalid Data Structure");
        }
      } catch (error) {
        // Silently fail to fallback so the console stays clean

        setData(FALLBACK_DATA);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [username]);

  if (loading) return <div className="w-full max-w-[350px] h-96 bg-card animate-pulse rounded-2xl border border-brand/20" />;

  // Calculate percentages safely
  const easyPer = (data.easySolved / (data.totalEasy || 1)) * 100;
  const medPer = (data.mediumSolved / (data.totalMedium || 1)) * 100;
  const hardPer = (data.hardSolved / (data.totalHard || 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="perspective-1000 w-full flex justify-center lg:justify-end"
    >
      <div className="relative w-full max-w-[350px] bg-card border-2 border-[#141414] rounded-2xl overflow-hidden preserve-3d group hover:border-brand/50 transition-all duration-500 shadow-2xl">
        
        {/* Header HUD */}
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="text-brand" size={18} />
            <span className="font-black italic uppercase text-[10px] tracking-widest text-white">LeetCode Protocol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-brand animate-pulse' : 'bg-zinc-600'}`} />
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isLive ? 'text-brand' : 'text-zinc-500'}`}>
              {isLive ? 'SYSTEM_LIVE' : 'CACHE_MODE'}
            </span>
          </div>
        </div>

        {/* Main Stats Body */}
        <div className="p-6 relative">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 custom-grid opacity-5 pointer-events-none" />

          <div className="relative z-10">
            <div className="mb-6">
              <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Efficiency Metrics</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-5xl font-black text-white italic leading-none">
                    {data.totalSolved}
                </h4>
                <span className="text-zinc-500 font-bold text-xs">/ {data.totalQuestions}</span>
              </div>
            </div>

            <div className="space-y-5">
              <StatBar label="Easy" solved={data.easySolved} total={data.totalEasy} color="bg-emerald-400" percent={easyPer} />
              <StatBar label="Medium" solved={data.mediumSolved} total={data.totalMedium} color="bg-yellow-400" percent={medPer} />
              <StatBar label="Hard" solved={data.hardSolved} total={data.totalHard} color="bg-red-500" percent={hardPer} />
            </div>

            {/* Global Rank & Acceptance */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-5 border-t border-white/10">
              <div>
                <div className="flex items-center gap-1 mb-1 text-zinc-500">
                  <Trophy size={10} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Global Rank</span>
                </div>
                <span className="text-xs font-black text-white italic">
                    #{data.ranking ? data.ranking.toLocaleString() : "N/A"}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1 text-zinc-500">
                  <Target size={10} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Acceptance</span>
                </div>
                <span className="text-xs font-black text-white italic">
                    {data.acceptanceRate ? Number(data.acceptanceRate).toFixed(1) : "0"}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatBar = ({ label, solved, total, color, percent }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
      <span>{label}</span>
      <span>{solved} / {total}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

export default LeetCodeCard;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, Copy, CheckCircle, Share2, 
  Users, AlertCircle, Monitor, Play, Smartphone
} from 'lucide-react';

const ConductExam = () => {
  const [sessionLink, setSessionLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  // 1. Simulate Link Generation on Mount
  useEffect(() => {
    // In real app, this comes from backend API
    const uniqueId = Math.random().toString(36).substring(7);
    setSessionLink(`https://aiteacher.com/exam/live/${uniqueId}`);

    // Simulate students joining (for visual effect)
    const interval = setInterval(() => {
      setStudentCount(prev => (prev < 5 ? prev + 1 : prev));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 2. Handle Copy Function
  const handleCopy = () => {
    navigator.clipboard.writeText(sessionLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- SECTION 1: HEADER & STATUS --- */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Session Active
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Exam Session Ready</h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Your secure exam environment is live. Share the link below with your students to begin.
          </p>
        </div>

        {/* --- SECTION 2: THE LINK CARD (Focus Area) --- */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-3xl p-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <LinkIcon size={16} className="text-indigo-600" /> Student Access Link
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-600 font-mono text-sm flex items-center overflow-x-auto">
              {sessionLink || "Generating unique link..."}
            </div>
            
            <button 
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
                isCopied 
                  ? 'bg-green-500 text-white shadow-green-500/30' 
                  : 'bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700'
              }`}
            >
              {isCopied ? <CheckCircle size={20} /> : <Copy size={20} />}
              {isCopied ? 'Copied!' : 'Copy Link'}
            </button>

            <button 
              onClick={() => window.open(`https://wa.me/?text=Join exam here: ${sessionLink}`, '_blank')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
            >
              <Share2 size={20} />
              WhatsApp
            </button>
          </div>
        </motion.div>

        {/* --- SECTION 3: INSTRUCTIONS (The "What to do" part) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InstructionCard 
            step="1"
            title="Share Link"
            desc="Copy the link above and share it via WhatsApp, Email, or LMS."
            icon={Share2}
            delay={0.2}
          />
          <InstructionCard 
            step="2"
            title="Students Join"
            desc="Students click the link, enter their names, and wait in the lobby."
            icon={Users}
            delay={0.3}
          />
          <InstructionCard 
            step="3"
            title="Monitor Live"
            desc="Watch real-time progress as students answer questions."
            icon={Monitor}
            delay={0.4}
          />
        </div>

        {/* --- SECTION 4: LIVE LOBBY (UX Delight) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-slate-200 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users size={20} className="text-slate-400" />
              Live Lobby
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {studentCount} Students Joined
            </span>
          </div>

          {studentCount === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
              <div className="animate-bounce inline-block p-3 bg-slate-50 rounded-full text-slate-300 mb-3">
                <Smartphone size={24} />
              </div>
              <p className="text-slate-400 text-sm">Waiting for students to join...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Fake Students for demo */}
              {Array.from({ length: studentCount }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl"
                >
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                    S{i+1}
                  </div>
                  <span className="text-sm font-medium text-slate-700">Student {i+1}</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full ml-auto"></span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

// Simple Sub-component for instructions
const InstructionCard = ({ step, title, desc, icon: Icon, delay }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-xl text-indigo-600">
        <Icon size={24} />
      </div>
      <span className="text-4xl font-black text-slate-100">{step}</span>
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </motion.div>
);

export default ConductExam;
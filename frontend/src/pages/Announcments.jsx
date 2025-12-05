import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Wand2, Send, Copy, 
  CheckCircle, MessageCircle, Sparkles, 
  AlignLeft, AlertCircle, Smile,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Announcement = () => {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [tone, setTone] = useState('Professional');

  // --- SEND REQUEST TO SERVER ---
  const handleGenerate = async (e) => {
  e.preventDefault();
  if (!rawText.trim()) return;

  setIsGenerating(true);
  setGeneratedText('');

  try {
    const response = await fetch(
      "http://10.160.195.175:5678/webhook/announcements/format",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: `${rawText} [${tone}]`
        })
      }
    );

    const data = await response.json();
    if (data?.output) {
      setGeneratedText(data.output);
    } else {
      setGeneratedText("⚠️ Error: Server did not return formatted text.");
    }

  } catch (error) {
    console.error(error);
    setGeneratedText("⚠️ Error: Unable to reach formatting server.");
  }

  setIsGenerating(false);
};


  // --- ACTIONS ---
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(generatedText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-800">
      
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Megaphone size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Announcement Maker</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Professional notices in seconds</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" /> 
          Back to Dashboard
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* LEFT SIDE */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full space-y-6"
          >
            <div className="lg:pt-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Draft your message</h2>
              <p className="text-slate-500">Turn your rough notes into professional notices instantly. Choose a tone and let the server handle the formatting.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-lg flex-1 flex flex-col">
              
              {/* TONE SELECTOR */}
              <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-xl w-fit">
                {['Professional', 'Urgent', 'Friendly'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                      tone === t 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t === 'Professional' && <AlignLeft size={14}/>}
                    {t === 'Urgent' && <AlertCircle size={14}/>}
                    {t === 'Friendly' && <Smile size={14}/>}
                    {t}
                  </button>
                ))}
              </div>

              {/* TEXT INPUT */}
              <div className="relative flex-1">
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="e.g., No class tomorrow due to heavy rain. Exam postponed to Monday."
                  className="w-full h-full min-h-[250px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none text-slate-700 leading-relaxed"
                />
                <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                  {rawText.length} chars
                </div>
              </div>

              {/* GENERATE BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating || !rawText}
                className="mt-6 w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative group"
              >
                {isGenerating ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Formatting...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} className="text-indigo-400" />
                    Generate Formal Message
                  </>
                )}

                {!isGenerating && (
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
                )}
              </motion.button>

            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col h-full justify-end">
            <AnimatePresence mode="wait">
              {!generatedText ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Sparkles size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Waiting for Input</h3>
                  <p className="text-slate-400 max-w-xs mt-2 text-sm">
                    Type your rough message on the left and the server will transform it into a formal announcement.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full flex flex-col"
                >
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-xl flex-1 flex flex-col overflow-hidden">
                    
                    {/* HEADER */}
                    <div className="bg-slate-900 p-4 px-6 flex justify-between items-center text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-bold text-sm tracking-wide">SERVER PREVIEW</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        {tone.toUpperCase()} MODE
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-8 bg-slate-50/50 flex-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                        {generatedText}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3">
                      
                      <button 
                        onClick={handleWhatsApp}
                        className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:bg-[#1ebc57] transition-all shadow-lg shadow-green-500/20 active:scale-95"
                      >
                        <MessageCircle size={20} />
                        Send via WhatsApp
                      </button>

                      <button 
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                      >
                        {isCopied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                        {isCopied ? 'Copied to Clipboard' : 'Copy Text'}
                      </button>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Announcement;

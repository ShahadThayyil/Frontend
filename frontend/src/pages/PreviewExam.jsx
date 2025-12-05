import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Download, Monitor, ArrowLeft, ArrowRight, // <--- Added ArrowRight here
  Printer, CheckCircle, Share2, 
  Globe, Clock, Users
} from 'lucide-react';

const PreviewExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from CreateExam page
  const examData = location.state?.examData;

  // Handle case where user comes here directly without generating
  if (!examData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">No Exam Generated</h2>
        <button onClick={() => navigate('/create-exam')} className="mt-4 text-indigo-600 underline">Go to Create Exam</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-6xl mx-auto">
        
        {/* Header Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button 
            onClick={() => navigate('/create-exam')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium self-start md:self-auto"
          >
            <ArrowLeft size={20} /> Back to Edit
          </button>
          
          <div className="flex items-center gap-2">
             <div className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2 border border-green-200">
                <CheckCircle size={14} /> AI Generated Successfully
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: THE EXAM PAPER --- */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden min-h-[800px] relative flex flex-col"
            >
              {/* Paper Header */}
              <div className="border-b border-slate-100 p-8 flex justify-between items-start bg-slate-50/30">
                <div className="flex items-center gap-5">
                  {examData.logo ? (
                    <img src={examData.logo} alt="College Logo" className="h-16 w-16 object-contain mix-blend-multiply" />
                  ) : (
                    <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs">LOGO</div>
                  )}
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">{examData.title}</h1>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><CheckCircle size={14}/> Max Marks: {examData.totalMarks}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 self-center" />
                      <span className="flex items-center gap-1"><Clock size={14}/> Time: 60 Mins</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 self-center" />
                      <span>{examData.questions.length} Questions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Area */}
              <div className="p-10 space-y-8 flex-1 bg-white">
                {examData.questions.map((q, idx) => (
                  <div key={idx} className="relative group">
                    <div className="flex gap-4">
                      <span className="font-bold text-slate-400 text-lg select-none">{idx + 1}.</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-lg text-slate-800 font-medium leading-relaxed">
                            {q.question}
                          </p>
                          <span className="ml-4 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 whitespace-nowrap">
                            {q.marks} {q.marks > 1 ? 'Marks' : 'Mark'}
                          </span>
                        </div>

                        {/* Options for MCQ */}
                        {q.type === 'MCQ' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 ml-1">
                            {q.options.map((opt, i) => (
                              <div key={i} className="text-sm font-medium text-slate-600 flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-default border border-transparent hover:border-slate-100">
                                <span className="font-bold text-slate-400 bg-slate-100 w-6 h-6 flex items-center justify-center rounded-full text-xs">
                                  {String.fromCharCode(65+i)}
                                </span> 
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paper Footer watermark */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Generated by AI Teacher Assistant • {new Date().getFullYear()}
                </p>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: ACTIONS --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Conduct Exam Card (Updated Modern Look) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden"
            >
              {/* Subtle Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Globe size={24} />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  Ready
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">Conduct Live Exam</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Create a secure, real-time exam session for your students instantly.
              </p>

              <div className="flex items-center gap-3 mb-6 text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1"><Monitor size={14}/> Web-based</div>
                <div className="w-px h-3 bg-slate-300"/>
                <div className="flex items-center gap-1"><Users size={14}/> Unlimited</div>
              </div>
              
              <button 
                onClick={() => navigate('/conduct-exam')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:translate-y-0.5"
              >
                Start Session <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* 2. Download Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg">
                    <Printer size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Export Paper</h3>
                </div>
              </div>
              
              <button 
                onClick={() => alert("Downloading PDF...")}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                <Download size={18} /> 
                Download PDF
              </button>
              <p className="text-[10px] text-slate-400 mt-3 text-center">
                Standard A4 Format • Watermark Free
              </p>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PreviewExam;
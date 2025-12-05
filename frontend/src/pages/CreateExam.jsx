import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Brain, CheckCircle, Wand2, 
  FileUp, ListChecks, Layers, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateExam = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Form State ---
  const [inputType, setInputType] = useState('text'); // 'text' | 'file'
  const [examMode, setExamMode] = useState('normal'); // 'normal' | 'mcq'
  
  const [formData, setFormData] = useState({
    topic: '',
    syllabusText: '',
    file: null,
    difficulty: 'Medium',
    
    // Normal Mode Configuration (Updated)
    normalMcqCount: 5,   // MCQs (1 Mark)
    q3Count: 4,          // Theory (3 Marks)
    q7Count: 2,          // Theory (7 Marks)
    
    // MCQ Only Mode Configuration
    totalMcqOnly: 20
  });

  // Handle Text/Number Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = parseInt(value) || 0;

    // Enforce Limits
    if (name === 'normalMcqCount') {
      if (val > 20) val = 20; // Max 20 for MCQs
    } else if (['q3Count', 'q7Count'].includes(name)) {
      if (val > 10) val = 10; // Max 10 for Theory questions
    } else if (name === 'totalMcqOnly') {
      if (val > 50) val = 50; // Max 50 for MCQ Only Mode
    } else {
        // For non-numeric inputs like topic
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
    }

    if (val < 0) val = 0;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  // Handle File Uploads
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file: file }));
    }
  };

  // --- API BASE URL ---
const API_URL = "http://10.160.195.175:5678/webhook/exam/generate-ai";

// --- API BASE URL ---

const handleGenerate = async (e) => {
  e.preventDefault();
  setIsGenerating(true);

  try {
    // Build counts based on exam mode
    let counts;

    if (examMode === "mcq") {
      // MCQ-only mode
      counts = {
        mcq: formData.totalMcqOnly,
        three_mark: 0,
        one_mark: 0
      };
    } else {
      // Normal mode
      counts = {
        mcq: formData.normalMcqCount,
        three_mark: formData.q3Count,
        one_mark: formData.q7Count   // backend expects this naming
      };
    }

    // PDF URL or null
    const syllabusUrl = formData.file 
      ? formData.file.url || null   // You can update this if uploading 🚀
      : formData.syllabusText || null;

    // Build final payload
    const payload = {
      topic: formData.topic,
      teacher_id: 1,
      class_id: 1,
      difficulty: formData.difficulty.toLowerCase(),
      counts,
      syllabus_url: syllabusUrl
    };

    console.log("Sending request payload:", payload);

    // --- SEND POST REQUEST TO YOUR BACKEND ---
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("AI Exam Response:", data);

    // 👇 Extract exam_id from backend response
    const examId = data.exam_id;

    // 👇 Persist exam_id in localStorage
    localStorage.setItem("exam_id", examId);

    setIsGenerating(false);

    // Navigate with AI-generated exam + exam_id
    navigate("/preview-exam", { 
      state: { 
        examData: data,
        examId 
      }
    });

  } catch (err) {
    setIsGenerating(false);
    console.error("Error generating exam:", err);
    alert("Failed to generate the exam. Check console for details.");
  }
};



  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-3xl mx-auto">
        
        {/* NEW: Back to Dashboard Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-full group-hover:border-slate-300 transition-all shadow-sm">
             <ArrowLeft size={18} />
          </div>
          Back to Dashboard
        </button>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <Brain size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create New Exam</h1>
              <p className="text-sm text-slate-500">Configure parameters for AI generation.</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-8">
            
            {/* Content Source */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Content Source</label>
              <div className="flex bg-slate-100 p-1.5 rounded-xl mb-4 w-full">
                <button type="button" onClick={() => setInputType('text')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${inputType === 'text' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Text Topic</button>
                <button type="button" onClick={() => setInputType('file')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${inputType === 'file' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Upload PDF</button>
              </div>

              <LayoutGroup>
                <AnimatePresence mode="wait">
                  {inputType === 'text' ? (
                    <motion.div key="text" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
                      <input 
                        type="text" name="topic" value={formData.topic} onChange={handleChange}
                        placeholder="Enter Exam Topic (e.g. History of India)" 
                        className="w-full mb-3 pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium"
                        required
                      />
                      <textarea 
                        name="syllabusText" value={formData.syllabusText} onChange={handleChange} rows="3"
                        placeholder="Paste specific syllabus or instructions here (Optional)..." 
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm resize-none"
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="file" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {formData.file ? (
                                <>
                                  <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                                  <p className="text-sm text-slate-700 font-bold">{formData.file.name}</p>
                                </>
                              ) : (
                                <>
                                  <FileUp className="w-8 h-8 text-slate-400 mb-2" />
                                  <p className="text-sm text-slate-500 font-medium">Click to upload Syllabus PDF</p>
                                </>
                              )}
                          </div>
                          <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e)} />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </LayoutGroup>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Exam Mode Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Exam Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  onClick={() => setExamMode('normal')}
                  className={`cursor-pointer relative p-5 rounded-2xl border-2 transition-all ${examMode === 'normal' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className={`p-2 w-fit rounded-lg mb-2 ${examMode === 'normal' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Layers size={20} />
                  </div>
                  <h3 className={`font-bold text-sm ${examMode === 'normal' ? 'text-indigo-900' : 'text-slate-700'}`}>Normal Exam</h3>
                  <p className="text-xs text-slate-500 mt-1">MCQ + 3 Mark + 7 Mark</p>
                  {examMode === 'normal' && <div className="absolute top-3 right-3 text-indigo-600"><CheckCircle size={18} /></div>}
                </motion.div>

                <motion.div 
                  onClick={() => setExamMode('mcq')}
                  className={`cursor-pointer relative p-5 rounded-2xl border-2 transition-all ${examMode === 'mcq' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className={`p-2 w-fit rounded-lg mb-2 ${examMode === 'mcq' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <ListChecks size={20} />
                  </div>
                  <h3 className={`font-bold text-sm ${examMode === 'mcq' ? 'text-indigo-900' : 'text-slate-700'}`}>MCQ Only</h3>
                  <p className="text-xs text-slate-500 mt-1">Objective Type Only</p>
                  {examMode === 'mcq' && <div className="absolute top-3 right-3 text-indigo-600"><CheckCircle size={18} /></div>}
                </motion.div>
              </div>
            </div>

            {/* Question Settings */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
               <LayoutGroup>
                 <AnimatePresence mode="wait">
                    {examMode === 'normal' ? (
                      <motion.div key="normal-settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                          <div className="flex items-center gap-2 mb-2 text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg text-xs font-semibold">
                             <AlertCircle size={14} /> Limits: MCQs (Max 20), Theory (Max 10 each)
                          </div>
                          
                          {/* MCQ Count */}
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold text-slate-700">MCQs (1 Mark)</span>
                             <input type="number" name="normalMcqCount" min="0" max="20" value={formData.normalMcqCount} onChange={handleChange} className="w-20 text-center p-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none text-sm font-bold shadow-sm" />
                          </div>

                          {/* 3 Mark Theory (UPDATED) */}
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold text-slate-700">Short Theory (3 Marks)</span>
                             <input type="number" name="q3Count" min="0" max="10" value={formData.q3Count} onChange={handleChange} className="w-20 text-center p-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none text-sm font-bold shadow-sm" />
                          </div>

                          {/* 7 Mark Theory (UPDATED) */}
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold text-slate-700">Long Theory (7 Marks)</span>
                             <input type="number" name="q7Count" min="0" max="10" value={formData.q7Count} onChange={handleChange} className="w-20 text-center p-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none text-sm font-bold shadow-sm" />
                          </div>
                      </motion.div>
                    ) : (
                      <motion.div key="mcq-settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold text-slate-700">Total MCQs</span>
                             <input type="number" name="totalMcqOnly" min="5" max="50" value={formData.totalMcqOnly} onChange={handleChange} className="w-20 text-center p-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none text-sm font-bold shadow-sm" />
                          </div>
                          <p className="text-xs text-slate-500 mt-2 font-medium">Recommended: 20-50 Questions</p>
                      </motion.div>
                    )}
                 </AnimatePresence>
               </LayoutGroup>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={isGenerating}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? <span className="animate-pulse">AI is Generating...</span> : <><Wand2 size={20} /> Generate Exam</>}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateExam;
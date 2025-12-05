import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Download, 
  Copy, 
  Check,
  Save,
  Share2,
  Sparkles,
  Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LessonPreview = () => {
  const navigate = useNavigate();

  // --- STATIC DATA (Standalone Mode) ---
  // Since we removed the route dependency, we use this hardcoded data for the preview.
  const formData = {
    topic: "Thermodynamics & Heat Transfer",
    grade: "Grade 11",
    duration: 1.5, // 1.5 Hours
    syllabusFile: null // or { name: "Syllabus.pdf" }
  };

  const [loading, setLoading] = useState(true);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [copied, setCopied] = useState(false);

  // --- Generation Logic ---
  useEffect(() => {
    // Simulate API Generation
    const generatePlan = () => {
      setTimeout(() => {
        const mockResponse = `
# Lesson Plan: ${formData.topic}
## Level: ${formData.grade} | Duration: ${formData.duration >= 1 ? formData.duration + ' Hour(s)' : (formData.duration * 60) + ' Minutes'}

### 1. Learning Objectives
- Comprehensive understanding of ${formData.topic} based on ${formData.grade} standards.
- Ability to solve complex problems related to the subject matter.
- Application of theoretical concepts to practical scenarios.

### 2. Prerequisites & Materials
- Basic understanding of previous modules.
- Scientific Calculator, Graph Paper, Reference Textbook (Vol 2).
- ${formData.syllabusFile ? 'Uploaded Syllabus Reference Document (PDF)' : 'Standard Curriculum Guidelines'}

### 3. Detailed Procedure
**Phase 1: Concept Introduction (15 mins)**
Start with a real-world problem statement to engage students. Define key terminologies associated with ${formData.topic}.

**Phase 2: Core Analysis (${(formData.duration * 60) * 0.5} mins)**
Deep dive into the derivation of formulas and core logic. 
*Instructor Note: Use the whiteboard to solve at least 2 numerical examples.*

**Phase 3: Group Activity (${(formData.duration * 60) * 0.25} mins)**
Split class into groups of 4. Assign a case study related to the syllabus context provided.

### 4. Assessment & Homework
- Pop quiz covering today's derivations.
- Assign 5 practice problems from the main textbook.
        `;
        setGeneratedPlan(mockResponse);
        setLoading(false);
      }, 2000); // 2 seconds loading
    };

    generatePlan();
  }, []); // Empty dependency array ensures it runs once on load

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/lesson-plan')} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back to Edit</span>
          </button>
        </div>
        
        {/* Action Buttons */}
        {!loading && (
          <div className="flex gap-3">
            <button 
              onClick={handleCopy}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95">
              <Download size={18} />
              Export PDF
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-10 flex items-start justify-center">
        
        {loading ? (
          // --- Loading State ---
          <div className="flex flex-col items-center justify-center mt-20 text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Structuring Lesson Plan...</h2>
              <p className="text-slate-500 mt-2">Analyzing <span className="font-semibold text-indigo-600">{formData.topic}</span> for {formData.grade}</p>
            </div>
          </div>
        ) : (
          // --- Result State ---
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl bg-white min-h-[85vh] shadow-xl shadow-slate-200/50 border border-slate-100 rounded-xl overflow-hidden flex flex-col"
          >
            {/* Toolbar */}
            <div className="h-14 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview Mode</span>
              <div className="flex gap-1">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-all" title="Print">
                  <Printer size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-all" title="Save to Cloud">
                  <Save size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-all" title="Share">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Content Body (Paper Effect) */}
            <div className="flex-1 p-8 md:p-16 prose prose-slate max-w-none">
               <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium font-serif text-lg">
                  {generatedPlan}
               </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400">
              Generated by EduGenius AI • {new Date().toLocaleDateString()}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default LessonPreview;
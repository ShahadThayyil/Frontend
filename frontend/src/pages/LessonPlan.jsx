import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  GraduationCap, 
  AlignLeft, 
  Sparkles, 
  UploadCloud, 
  FileType, 
  Trash2, 
  ChevronLeft,
  Minus,
  Plus
} from 'lucide-react';

// Removed 'react-router-dom' imports since we just want the page UI
// import { Link, useNavigate } from 'react-router-dom'; 

const LessonPlan = () => {
  // const navigate = useNavigate(); // Removed navigation hook
  const fileInputRef = useRef(null);
  const [syllabusMode, setSyllabusMode] = useState('text'); 

  // --- Grade Options Data ---
  const gradeOptions = [
    { label: "Schooling", options: ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
    { label: "Diploma / Vocational", options: ["Polytechnic Diploma", "ITI (Industrial Training)", "Vocational Course"] },
    { label: "Undergraduate (UG)", options: ["B.Tech / B.E.", "B.Sc", "B.Com", "B.A.", "BBA", "BCA", "MBBS", "B.Pharm"] },
    { label: "Postgraduate (PG)", options: ["M.Tech / M.E.", "M.Sc", "M.Com", "M.A.", "MBA", "MCA", "PhD / Research"] },
  ];

  // --- State ---
  const [gradeSelect, setGradeSelect] = useState('Grade 10'); 
  const [formData, setFormData] = useState({
    topic: '',
    duration: 1.0, 
    grade: 'Grade 10', 
    syllabusText: '',
    syllabusFile: null
  });

  // --- Handlers ---
  const handleDurationChange = (amount) => {
    setFormData(prev => {
      const newValue = prev.duration + amount;
      return { ...prev, duration: Math.max(0.5, newValue) };
    });
  };

  const formatDurationDisplay = (hours) => {
    if (hours < 1) return `${hours * 60} Mins`;
    if (hours === 1) return "1 Hour";
    const h = Math.floor(hours);
    const m = (hours - h) * 60;
    return m === 0 ? `${h} Hours` : `${h} Hr ${m} Mins`;
  };

  const handleGradeSelectChange = (e) => {
    const value = e.target.value;
    setGradeSelect(value);
    if (value === 'Other') {
      setFormData(prev => ({ ...prev, grade: '' }));
    } else {
      setFormData(prev => ({ ...prev, grade: value }));
    }
  };

  const handleCustomGradeChange = (e) => {
    setFormData(prev => ({ ...prev, grade: e.target.value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, syllabusFile: file }));
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, syllabusFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // STOPPED NAVIGATION HERE
    console.log("Form Submitted:", formData);
    alert("Generate Clicked! (Navigation is disabled)");
    // navigate('/lesson-plan/preview', { state: { formData } }); 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Lesson Plan Generator</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Create structured teaching guides</p>
          </div>
        </div>
        
        {/* Changed Link to a simple button/div since we aren't using Router */}
        <button className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50">
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" /> 
          Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white p-6 lg:p-10 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">1</span>
              Configure Lesson Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Topic / Chapter Name</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="e.g. Thermodynamics, Data Structures, Modern History..."
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Grid: Grade & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Grade Selection */}
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Education Level</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <select 
                      value={gradeSelect}
                      onChange={handleGradeSelectChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 appearance-none cursor-pointer"
                    >
                      {gradeOptions.map((group, index) => (
                        <optgroup key={index} label={group.label}>
                          {group.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="Other">Other (Type Custom)</option>
                    </select>
                  </div>

                  {/* Custom Grade Input Animation */}
                  <AnimatePresence>
                    {gradeSelect === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                         <input 
                          type="text"
                          placeholder="Type specific grade/course here..."
                          value={formData.grade}
                          onChange={handleCustomGradeChange}
                          className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-900 placeholder:text-indigo-400 text-sm"
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Duration Stepper */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => handleDurationChange(-0.5)}
                      className="w-12 h-[50px] flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors active:scale-95"
                    >
                      <Minus size={20} />
                    </button>
                    
                    <div className="flex-1 relative">
                      <Clock className="absolute left-4 top-3.5 text-indigo-500" size={18} />
                      <div className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold text-center select-none shadow-sm">
                        {formatDurationDisplay(formData.duration)}
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleDurationChange(0.5)}
                      className="w-12 h-[50px] flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Syllabus Context */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-4">Syllabus Context (Optional)</label>
                
                <div className="flex bg-slate-200 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setSyllabusMode('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      syllabusMode === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <AlignLeft size={16} /> Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setSyllabusMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      syllabusMode === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <UploadCloud size={16} /> Upload PDF
                  </button>
                </div>

                {syllabusMode === 'text' ? (
                  <textarea 
                    name="syllabusText"
                    value={formData.syllabusText}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Paste syllabus modules, key topics, or learning outcomes here..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 placeholder:text-slate-400 text-sm resize-none"
                  ></textarea>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-colors p-8 text-center relative group">
                    {formData.syllabusFile ? (
                      <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <FileType size={20} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{formData.syllabusFile.name}</p>
                            <p className="text-xs text-slate-500">{(formData.syllabusFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button type="button" onClick={removeFile} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => fileInputRef.current.click()} className="cursor-pointer py-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-50 transition-colors">
                          <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Click to upload PDF</p>
                        <p className="text-xs text-slate-400 mt-1">Maximum file size 10MB</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={!formData.topic || !formData.grade}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] hover:scale-[1.01]"
              >
                <Sparkles size={20} />
                Generate Lesson Plan
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LessonPlan;
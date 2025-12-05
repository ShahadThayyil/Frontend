import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, GraduationCap, AlignLeft, Sparkles, UploadCloud, 
  FileType, Trash2, ChevronLeft, Minus, Plus, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LessonPlan = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [syllabusMode, setSyllabusMode] = useState('text');
  const [isGenerating, setIsGenerating] = useState(false);

  const gradeOptions = [
    { label: "Schooling", options: ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
    { label: "Diploma / Vocational", options: ["Polytechnic Diploma", "ITI (Industrial Training)", "Vocational Course"] },
    { label: "Undergraduate (UG)", options: ["B.Tech / B.E.", "B.Sc", "B.Com", "B.A.", "BBA", "BCA", "MBBS", "B.Pharm"] },
    { label: "Postgraduate (PG)", options: ["M.Tech / M.E.", "M.Sc", "M.Com", "M.A.", "MBA", "MCA", "PhD / Research"] },
  ];

  const [gradeSelect, setGradeSelect] = useState('Grade 10');
  const [formData, setFormData] = useState({
    topic: '',
    duration: 1.0,
    grade: 'Grade 10',
    syllabusText: '',
    syllabusFile: null
  });

  // -----------------------
  // Helpers & Handlers
  // -----------------------

  const handleDurationChange = (amount) => {
    setFormData(prev => ({
      ...prev,
      duration: Math.max(0.5, +(prev.duration + amount).toFixed(1))
    }));
  };

  const formatDurationDisplay = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} Mins`;
    if (hours === 1) return "1 Hour";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m === 0 ? `${h} Hours` : `${h} Hr ${m} Mins`;
  };

  const handleGradeSelectChange = (e) => {
    const value = e.target.value;
    setGradeSelect(value);

    setFormData(prev => ({
      ...prev,
      grade: value === "Other" ? "" : value
    }));
  };

  const handleCustomGradeChange = (e) => {
    setFormData(prev => ({ ...prev, grade: e.target.value }));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, syllabusFile: file }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, syllabusFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -----------------------
  // UPDATED SUBMIT WITH API CALL 🔥
  // -----------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (gradeSelect === "Other" && !formData.grade.trim()) {
      alert("Please enter a custom grade level.");
      return;
    }

    setIsGenerating(true);

    try {
      const endpoint = "http://10.160.195.175:5678/webhook/lessonplan/generate";

      let response;

      // If file uploaded → send multipart/form-data
      if (formData.syllabusFile) {
        const fd = new FormData();
        fd.append("topic", formData.topic);
        fd.append("hours", formData.duration);
        fd.append("specific_focus", "");
        fd.append("file", formData.syllabusFile);

        response = await fetch(endpoint, {
          method: "POST",
          body: fd
        });

      } else {
        // Else → JSON
        const payload = {
          topic: formData.topic,
          hours: formData.duration,
          specific_focus: formData.syllabusText || ""
        };

        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      console.log("API RESPONSE:", data);

      // If backend returns an ID, use it
      const id = data.id || Math.floor(Math.random() * 1000);

      //navigate(`/dashboard/lesson-plan/preview/${id}`);
      navigate(`/dashboard/lesson-plan/preview/${id}`, {
  state: { lessonPlan: data.output }
});

    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  // -----------------------
  // JSX UI
  // -----------------------

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

        <button 
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1" /> 
          Back to Dashboard
        </button>
      </header>

      {/* MAIN */}
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

              {/* TOPIC */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Topic / Chapter Name</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="e.g. Thermodynamics, Data Structures..."
                    required
                    disabled={isGenerating}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Grade selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-slate-700 mb-2">Education Level</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-3.5 text-slate-400" size={18} />

                    <select 
                      value={gradeSelect}
                      onChange={handleGradeSelectChange}
                      disabled={isGenerating}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {gradeOptions.map((group, i) => (
                        <optgroup key={i} label={group.label}>
                          {group.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="Other">Other (Type Custom)</option>
                    </select>
                  </div>

                  <AnimatePresence>
                    {gradeSelect === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                        <input 
                          type="text"
                          value={formData.grade}
                          onChange={handleCustomGradeChange}
                          disabled={isGenerating}
                          placeholder="Enter custom grade..."
                          className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                  <div className="flex items-center gap-3">

                    <button type="button"
                      disabled={isGenerating}
                      onClick={() => handleDurationChange(-0.5)}
                      className="w-12 h-[50px] flex items-center justify-center rounded-xl border bg-slate-50"
                    >
                      <Minus size={20} />
                    </button>

                    <div className="flex-1 relative">
                      <Clock className="absolute left-4 top-3.5 text-indigo-500" size={18} />
                      <div className="w-full pl-11 py-3 bg-white border rounded-xl text-center font-semibold">
                        {formatDurationDisplay(formData.duration)}
                      </div>
                    </div>

                    <button type="button"
                      disabled={isGenerating}
                      onClick={() => handleDurationChange(0.5)}
                      className="w-12 h-[50px] flex items-center justify-center rounded-xl border bg-slate-50"
                    >
                      <Plus size={20} />
                    </button>

                  </div>
                </div>

              </div>

              {/* SYLLABUS CONTEXT */}
              <div className="p-6 bg-slate-50 rounded-2xl border">

                <label className="block text-sm font-bold text-slate-700 mb-4">Syllabus Context (Optional)</label>

                <div className="flex bg-slate-200 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setSyllabusMode("text")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${
                      syllabusMode === "text" ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                    }`}
                  >
                    <AlignLeft size={16} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSyllabusMode("upload")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${
                      syllabusMode === "upload" ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                    }`}
                  >
                    <UploadCloud size={16} />
                  </button>
                </div>

                {syllabusMode === "text" ? (
                  <textarea 
                    name="syllabusText"
                    value={formData.syllabusText}
                    onChange={handleInputChange}
                    rows="5"
                    disabled={isGenerating}
                    placeholder="Paste syllabus modules here..."
                    className="w-full px-4 py-3 bg-white border rounded-xl resize-none"
                  />
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-xl p-8 text-center bg-white"
                  >
                    {formData.syllabusFile ? (
                      <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <FileType size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{formData.syllabusFile.name}</p>
                            <p className="text-xs text-slate-500">
                              {(formData.syllabusFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        <button 
                          type="button" 
                          onClick={removeFile} 
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isGenerating}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <UploadCloud className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Click to upload PDF</p>
                        <p className="text-xs text-slate-400">Max size: 10MB</p>
                      </button>
                    )}

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}

              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit"
                disabled={!formData.topic || !formData.grade || isGenerating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Lesson Plan
                  </>
                )}
              </button>

            </form>

          </div>

        </motion.div>

      </main>

    </div>
  );
};

export default LessonPlan;

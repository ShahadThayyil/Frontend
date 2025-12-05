 import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import {

  Download, ArrowLeft, ArrowRight,

  Printer, CheckCircle, Clock, Users,Play

} from 'lucide-react';


const PreviewExam = () => {

  const location = useLocation();

  const navigate = useNavigate();

 

  const [examData, setExamData] = useState(null);

  const [loading, setLoading] = useState(true);


  // Retrieve examId from state → fallback to localStorage

  const examId = location.state?.examId || localStorage.getItem("exam_id");


  useEffect(() => {

    if (!examId) return;


   
   const fetchExam = async () => {
  try {
    setLoading(true);
    const res = await fetch(`http://10.160.195.16:8000/api/v1/questions/exam/${examId}`);
    const data = await res.json();

    if (!data || !data[0]) {
      console.error("Exam data not found or invalid");
      setExamData(null);
      return;
    }

    const questions = [
      ...(data[0]?.mcq?.map(q => ({ ...q, type: 'MCQ', marks: 1 })) || []),
      ...(data[0]?.one_mark?.map(q => ({ ...q, type: 'Theory', marks: 1 })) || []),
      ...(data[0]?.three_mark?.map(q => ({ ...q, type: 'Theory', marks: 3 })) || []),
    ];

    setExamData({
      exam_id: data[0].exam_id,
      questions,
      totalMarks: questions.reduce((sum, q) => sum + (q.marks || 1), 0),
      title: `Exam #${data[0].exam_id}`
    });
  } catch (err) {
    console.error("Failed to fetch exam:", err);
  } finally {
    setLoading(false);
  }
};



    fetchExam();

  }, [examId]);


  if (!examId) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">

        <h2 className="text-xl font-bold text-slate-800">No Exam ID Found</h2>

        <button onClick={() => navigate('/create-exam')} className="mt-4 text-indigo-600 underline">Go to Create Exam</button>

      </div>

    );

  }


  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <span className="text-indigo-600 font-bold text-lg animate-pulse">Loading Exam...</span>

      </div>

    );

  }


  if (!examData) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">

        <h2 className="text-xl font-bold text-slate-800">Failed to Load Exam</h2>

        <button onClick={() => navigate('/create-exam')} className="mt-4 text-indigo-600 underline">Go to Create Exam</button>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

          <button

            onClick={() => navigate('/create-exam')}

            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"

          >

            <div className="p-2 bg-white rounded-full border border-slate-200 shadow-sm">

                <ArrowLeft size={18} />

            </div>

            Back to Edit

          </button>

         

          <div className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2 border border-green-200 shadow-sm">

             <CheckCircle size={14} /> AI Generated Successfully

          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Exam Paper */}

          <div className="lg:col-span-8 w-full">

            <motion.div

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              className="bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden flex flex-col relative"

              style={{ height: '850px', maxHeight: '85vh' }}

            >

              {/* Paper Header */}

              <div className="flex-none border-b border-slate-100 p-8 bg-slate-50/30 text-center">

                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide mb-3">

                    {examData.title}

                  </h1>

                  <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500">

                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">

                        <CheckCircle size={14}/> Marks: {examData.totalMarks}

                    </span>

                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">

                        <Clock size={14}/> Time: 60 Min

                    </span>

                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">

                        <Users size={14}/> {examData.questions.length} Qs

                    </span>

                    <span className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200 text-indigo-700">

                        Exam ID: {examData.exam_id}

                    </span>

                  </div>

              </div>


              {/* Questions */}

              <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 bg-white scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

                {examData.questions.map((q, idx) => (

                  <div key={idx} className="relative group">

                    <div className="flex gap-4">

                      <span className="flex-none font-bold text-slate-300 text-xl select-none w-8 text-right pt-0.5">{idx + 1}.</span>

                      <div className="flex-1">

                        <div className="flex justify-between items-start gap-4">

                          <p className="text-lg text-slate-800 font-medium leading-relaxed">{q.question}</p>

                          <span className="flex-none text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 whitespace-nowrap">

                            [{q.marks || 1}]

                          </span>

                        </div>


                        {/* MCQ Options */}

                        {q.type === 'MCQ' && (

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                            {q.options.map((opt, i) => (

                              <div key={i} className="text-sm font-medium text-slate-600 flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">

                                <span className="font-bold text-slate-400 bg-slate-100 w-6 h-6 flex items-center justify-center rounded-full text-xs transition-colors border border-slate-200">

                                  {String.fromCharCode(65+i)}

                                </span>

                                {opt}

                              </div>

                            ))}

                          </div>

                        )}


                        {/* Theory Writing Lines */}

                        {q.type !== 'MCQ' && (

                           <div className="mt-4 border-l-2 border-slate-100 pl-4 space-y-3 opacity-50">

                              <div className="h-px bg-slate-100 w-full" />

                              <div className="h-px bg-slate-100 w-full" />

                              {q.marks > 3 && <div className="h-px bg-slate-100 w-full" />}

                           </div>

                        )}


                      </div>

                    </div>

                  </div>

                ))}

              </div>


              {/* Footer */}

              <div className="flex-none p-4 border-t border-slate-100 bg-slate-50/50 text-center z-10">

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">

                  Generated by AI Teacher Assistant • {new Date().getFullYear()}

                </p>

              </div>


            </motion.div>

          </div>


          {/* Right Column: Actions */}

          <div className="lg:col-span-4 space-y-6">
            {/* --- NEW CARD: CONDUCT EXAM --- */}
<motion.div 
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-indigo-600 p-6 rounded-2xl border border-indigo-500 shadow-xl shadow-indigo-200"
>
  <div className="flex items-center gap-3 mb-4 text-white">
      <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
        <Play size={20} fill="currentColor" />
      </div>
      <div>
        <h3 className="font-bold text-lg">Conduct Exam</h3>
        <p className="text-xs text-indigo-100 opacity-90">Start live student session</p>
      </div>
  </div>
  
  <button 
    onClick={() => navigate(`/conduct-exam/${examData.exam_id}`)}
    className="w-full flex items-center justify-center gap-2 bg-white text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
  >
    Launch Session <ArrowRight size={18} />
  </button>
</motion.div>

            {/* Export PDF */}

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"

            >

              <div className="flex items-center gap-3 mb-4">

                  <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg">

                    <Printer size={20} />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900 text-sm">Export Paper</h3>

                    <p className="text-xs text-slate-500">PDF Format • A4 Size</p>

                  </div>

              </div>

             

              <button

  onClick={() => {

    const pdfUrl = `http://10.160.195.16:8000/api/v1/questions/exam/${examData.exam_id}/pdf`;

    window.open(pdfUrl, "_blank");

  }}

  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"

>

  <Download size={18} />

  Download PDF

</button>


            </motion.div>

          </div>

        </div>

      </div>

    </div>

  );

};


export default PreviewExam; 
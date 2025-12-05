import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConductExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [answers, setAnswers] = useState({});
  const [examStarted, setExamStarted] = useState(false);

  // Fetch exam
  useEffect(() => {
    if (!examId) return;
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://10.160.195.16:8000/api/v1/questions/exam/${examId}`);
        const data = await res.json();

        const questions = [
          ...data[0].mcq.map(q => ({ ...q, type: 'MCQ', marks: 1 })),
          ...data[0].one_mark.map(q => ({ ...q, type: 'Theory', marks: 1 })),
          ...data[0].three_mark.map(q => ({ ...q, type: 'Theory', marks: 3 })),
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

  // Cheat prevention
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) alert("Switching tabs is not allowed!");
    };
    const handleResize = () => {
      alert("Resizing window is not allowed!");
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStart = () => {
    if (!studentName || !rollNumber) return alert("Enter name and roll number!");
    setExamStarted(true);
  };

  const handleAnswerChange = (idx, value) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const handleSubmit = async () => {
    const items = examData.questions.map((q, i) => ({
      question: q.question,
      type: q.type === 'MCQ' ? 'mcq' : q.marks === 1 ? 'one_mark' : 'three_mark',
      options: q.options || undefined,
      student_answer: answers[i] || '',
      marks: q.type === 'MCQ' ? (answers[i] === q.correct_answer ? 1 : 0) : q.marks
    }));

    const payload = {
      exam_id: examData.exam_id,
      student_id: rollNumber,
      items
    };

    try {
      await axios.post('http://10.160.195.175:5678/webhook/exam/submit', payload);
      alert("Exam submitted successfully!");
      // Redirect to result page
      navigate(`/exam/${examData.exam_id}/student/${rollNumber}/result`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit exam.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading Exam...</div>;
  if (!examData) return <div className="p-6 text-center">Exam not found.</div>;

  if (!examStarted) {
    return (
      <div className="p-6 max-w-md mx-auto mt-24 bg-white shadow-xl rounded-xl space-y-4">
        <h2 className="text-xl font-bold">Enter Your Details</h2>
        <input 
          type="text" placeholder="Name" 
          className="border p-2 w-full rounded"
          value={studentName} onChange={e => setStudentName(e.target.value)}
        />
        <input 
          type="text" placeholder="Roll Number" 
          className="border p-2 w-full rounded"
          value={rollNumber} onChange={e => setRollNumber(e.target.value)}
        />
        <button 
          onClick={handleStart} 
          className="w-full bg-indigo-600 text-white py-2 rounded mt-2"
        >
          Start Exam
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">{examData.title}</h1>
      <div className="bg-white shadow-xl rounded-xl border border-slate-200 overflow-y-auto max-h-[80vh] p-6 space-y-6">
        {examData.questions.map((q, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="font-medium text-lg">{idx + 1}. {q.question}</p>
              <span className="text-sm text-slate-400">[{q.marks}]</span>
            </div>

            {q.type === 'MCQ' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={opt[0]}
                      checked={answers[idx] === opt[0]}
                      onChange={e => handleAnswerChange(idx, e.target.value)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="border p-2 w-full rounded"
                rows={q.marks === 3 ? 5 : 3}
                value={answers[idx] || ''}
                onChange={e => handleAnswerChange(idx, e.target.value)}
              />
            )}
          </div>
        ))}

        <button 
          onClick={handleSubmit} 
          className="w-full bg-green-500 text-white py-2 rounded mt-4"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default ConductExam;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResultPage = () => {
  const { examId, studentId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://10.160.195.16:8000/api/v1/exams/${examId}/student/${studentId}`
        );
        setResultData(res.data);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, studentId]);

  if (loading) return <div className="p-6 text-center">Loading results...</div>;
  if (!resultData) return <div className="p-6 text-center">No results found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Exam Results</h1>
        <p className="text-lg font-medium">Total Marks: {resultData.total_marks}</p>

        {resultData.results.map((item, idx) => (
          <div key={idx} className="p-4 border rounded space-y-2">
            <p className="font-medium">
              Q{idx + 1}: <span className={item.is_correct ? 'text-green-600' : 'text-red-600'}>
                {item.is_correct ? 'Correct' : 'Incorrect'}
              </span>
            </p>
            <p><strong>Your Answer:</strong> {item.student_answer}</p>
            <p><strong>Correct Answer:</strong> {item.correct_answer}</p>
            <p className="text-sm text-slate-600"><strong>Feedback:</strong> {item.feedback}</p>
          </div>
        ))}

        <Link
          to="/"
          className="inline-block mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;

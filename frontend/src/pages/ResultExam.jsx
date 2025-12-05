import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileDown, RefreshCw, Search, Trophy, 
  Users, TrendingUp, AlertCircle, ArrowLeft,
  CheckCircle, XCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// --- Sub-Component: Stat Card ---
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${bg} ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const ResultExam = () => {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Data State
  const [examStats, setExamStats] = useState({
    title: "Mid-Term Physics Exam",
    date: "Dec 12, 2024",
    totalStudents: 45,
    averageScore: 78,
    highestScore: 98,
    passPercentage: 92
  });

  const [students, setStudents] = useState([]);

  // Simulate API Fetch
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // Helper to calculate grade
      const calculateGrade = (marks) => {
        if (marks >= 90) return 'A+';
        if (marks >= 80) return 'A';
        if (marks >= 70) return 'B+';
        if (marks >= 60) return 'B';
        if (marks >= 50) return 'C';
        return 'F';
      };

      // Dummy Student Data Generator
      const dummyStudents = Array.from({ length: 15 }).map((_, i) => {
        const score = Math.floor(Math.random() * (100 - 40) + 40); // Random score 40-100
        return {
          id: i,
          rollNo: `24CS${100 + i}`,
          name: [`Arjun Krishna`, `Sneha Menon`, `Rahul R`, `Fatima S`, `John Paul`][i % 5] + ` ${String.fromCharCode(65+i)}`,
          marks: score,
          total: 100,
          grade: calculateGrade(score),
          status: score >= 50 ? 'Pass' : 'Fail'
        };
      });
      
      // Sort by marks (highest first)
      setStudents(dummyStudents.sort((a, b) => b.marks - a.marks));
      setIsLoading(false);
    }, 1500);
  }, []);

  // Filter logic for Search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 font-medium"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900">{examStats.title}</h1>
            <p className="text-slate-500 text-sm mt-1">Conducted on {examStats.date} • Exam ID: #{exam_id || 'EX-2024'}</p>
          </div>

          <div className="flex gap-3">
            {/* Regrade Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold shadow-sm">
              <RefreshCw size={18} /> Regrade
            </button>
            {/* Download CSV Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200">
              <FileDown size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* --- ANALYTICS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={Users} color="text-blue-600" bg="bg-blue-50"
            label="Total Students" value={examStats.totalStudents} 
          />
          <StatCard 
            icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50"
            label="Average Score" value={`${examStats.averageScore}%`} 
          />
          <StatCard 
            icon={Trophy} color="text-amber-600" bg="bg-amber-50"
            label="Highest Score" value={`${examStats.highestScore}/100`} 
          />
          <StatCard 
            icon={AlertCircle} color="text-indigo-600" bg="bg-indigo-50"
            label="Pass Percentage" value={`${examStats.passPercentage}%`} 
          />
        </div>

        {/* --- STUDENT RESULTS TABLE --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Student Marks</h2>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by Name or Roll No..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4 text-center">Marks Obtained</th>
                  <th className="px-6 py-4 text-center">Percentage</th>
                  <th className="px-6 py-4 text-center">Grade</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  // Skeleton Loading Rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-100 rounded mx-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-100 rounded mx-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-8 bg-slate-100 rounded mx-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded-full mx-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-slate-800">{student.marks}</span>
                        <span className="text-slate-400 text-xs"> / {student.total}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px] mx-auto overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full" 
                            style={{ width: `${(student.marks/student.total)*100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 mt-1 block">
                          {Math.round((student.marks/student.total)*100)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block w-8 h-8 leading-8 rounded-lg text-sm font-bold ${
                          student.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                          student.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          student.grade === 'F' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          student.status === 'Pass' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {student.status === 'Pass' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {!isLoading && filteredStudents.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                No students found matching "{searchTerm}"
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ResultExam;
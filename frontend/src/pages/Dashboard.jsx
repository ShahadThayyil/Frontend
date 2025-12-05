import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Megaphone, 
  Plus, 
  BookOpen, 
  Users, 
  Settings, 
  Menu, 
  X,
  Search,
  Bell,
  ChevronRight,
  LogOut // Imported here
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Mock Data ---
const recentExams = [
  { id: 1, title: 'Physics Final: Thermodynamics', class: 'Class 10-A', date: 'Oct 10, 2025', status: 'Completed' },
  { id: 2, title: 'Chemistry: Organic Compounds', class: 'Class 12-B', date: 'Oct 15, 2025', status: 'Scheduled' },
  { id: 3, title: 'Biology: Plant Systems', class: 'Class 9-C', date: 'Oct 20, 2025', status: 'Draft' },
];

const recentActivities = [
  { id: 1, type: 'Lesson Plan', title: 'Newton\'s Laws of Motion', date: '2 hours ago', icon: BookOpen },
  { id: 2, type: 'Announcement', title: 'Science Fair Registration', date: '5 hours ago', icon: Megaphone },
  { id: 3, type: 'Lesson Plan', title: 'Introduction to Calculus', date: '1 day ago', icon: BookOpen },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, to }) => (
  <Link 
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const QuickActionCard = ({ title, desc, icon: Icon, colorClass, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay, duration: 0.4 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 text-left w-full group"
  >
    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={24} className="text-white" />
    </div>
    <h3 className="text-slate-800 font-bold text-lg mb-1">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </motion.button>
);

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* --- Mobile Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-slate-800">EduGenius</span>
            <button className="ml-auto lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={true} to="/dashboard" />
            <SidebarItem icon={FileText} label="Exams" to="/create-exam" />
            <SidebarItem icon={BookOpen} label="Lesson Plans" to="/lesson-plan" />
            <SidebarItem icon={Megaphone} label="Announcements" to="/announcement" />
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</p>
            </div>
            <SidebarItem icon={Users} label="Students" to="/students" />
            <SidebarItem icon={Settings} label="Settings" to="/settings" />
          </nav>

          {/* --- NEW: Logout Section --- */}
          <div className="px-4 pb-2">
             <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-slate-500 hover:bg-red-50 hover:text-red-600">
                <LogOut size={20} className="text-slate-400 group-hover:text-red-600" />
                <span className="font-medium text-sm">Logout</span>
             </button>
          </div>

          {/* User Profile Snippet */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                T
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Teacher Account</p>
                <p className="text-xs text-slate-500">vynx@edugenius.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 w-48 ml-2 placeholder:text-slate-400" 
              />
            </div>
            <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Hello, Vynx! 👋</h2>
                <p className="text-slate-500 mt-1">Here's what's happening in your classes today.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
              >
                <Plus size={20} />
                Create New Exam
              </motion.button>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard 
                title="Exam Builder" 
                desc="Create quizzes using AI support." 
                icon={FileText} 
                colorClass="bg-indigo-500"
                delay={0.1}
              />
              <QuickActionCard 
                title="Lesson Plan" 
                desc="Generate structured plans instantly." 
                icon={BookOpen} 
                colorClass="bg-emerald-500"
                delay={0.2}
              />
              <QuickActionCard 
                title="Announcement" 
                desc="Notify students about updates." 
                icon={Megaphone} 
                colorClass="bg-sky-500"
                delay={0.3}
              />
            </div>

            {/* Main Data Split: Exams (Left) & Recent Activity (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Exams List */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Recent Exams</h3>
                  <Link to="/create-exam" className="text-sm text-indigo-600 font-semibold hover:underline">View All</Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-left border-b border-slate-100">
                      <tr>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Exam Title</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Class</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentExams.map((exam) => (
                        <tr key={exam.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-4 text-sm font-medium text-slate-700 group-hover:text-indigo-600">{exam.title}</td>
                          <td className="py-4 text-sm text-slate-500">{exam.class}</td>
                          <td className="py-4 text-sm text-slate-500">{exam.date}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${exam.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : ''}
                              ${exam.status === 'Scheduled' ? 'bg-sky-100 text-sky-800' : ''}
                              ${exam.status === 'Draft' ? 'bg-slate-100 text-slate-600' : ''}
                            `}>
                              {exam.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Recent Activity / Quick Links */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {recentActivities.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors">
                        <item.icon size={18} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Created a {item.type} • {item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-8 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                  View All Activity
                  <ChevronRight size={16} />
                </button>
              </motion.div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import progressService from '../../services/progressService';
import toast from 'react-hot-toast';
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from 'lucide-react';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Data__dashboardData", data);
        setDashboardData(data.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 text-sm">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/25',
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25',
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm">Track your learning progress and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
          >
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}
            >
              <stat.icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
            <Clock size={18} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        </div>

        {dashboardData?.recentActivity &&
        (dashboardData.recentActivity.documents?.length > 0 ||
          dashboardData.recentActivity.quizzes?.length > 0) ? (
          <div className="space-y-3">
            {[
              ...(dashboardData.recentActivity.documents || []).map((doc) => ({
                id: doc._id,
                description: doc.title,
                timestamp: doc.lastAccessed,
                link: `/documents/${doc._id}`,
                type: 'document',
              })),
              ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                id: quiz._id,
                description: quiz.title,
                timestamp: quiz.lastAttempted,
                link: `/quizzes/${quiz._id}`,
                type: 'quiz',
              })),
            ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-300/60 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activity.type === 'document'
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                          : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-slate-700">
                        {activity.type === 'document' ? 'Accessed Document: ' : 'Attempted Quiz: '}
                        <span className="font-semibold text-slate-900">{activity.description}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recently'}
                      </p>
                    </div>
                  </div>

                  {activity.link && (
                    <Link
                      to={activity.link}
                      className="px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 whitespace-nowrap"
                    >
                      View
                    </Link>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No recent activity to show.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
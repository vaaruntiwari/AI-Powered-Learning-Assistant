import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  LayoutDashboard,
  Award,
  Target,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const QuizResultPage = () => {
  const params = useParams();
  // Fallback for :quizId or :id routes
  const quizId = params.quizId || params.id;

  const navigate = useNavigate();

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResult = async () => {
      if (!quizId) {
        toast.error('Invalid Quiz ID');
        setLoading(false);
        return;
      }

      try {
        const response = await quizService.getQuizResults(quizId);
        
        // Unwrap Axios response + backend { success: true, data: { ... } } wrapper
        const payload = response.data?.data || response.data?.result || response.data;
        setResultData(payload);
      } catch (error) {
        toast.error('Failed to load quiz results.');
        console.error('Quiz result fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResult();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-slate-600 text-lg font-medium">
          No result data found for this quiz.
        </p>
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // --- SAFE EXTRACTION LOGIC MATCHING YOUR BACKEND RESPONSE ---

  // Questions / Results array extraction
  const questionsList = 
    resultData.results || 
    resultData.questions || 
    resultData.quiz?.questions || 
    [];

  // Total Questions
  const totalQuestions = 
    resultData.totalQuestions ?? 
    resultData.total ?? 
    questionsList.length ?? 
    0;

  // Score extraction (computes directly from results array if not explicitly given)
  const score = 
    resultData.score ?? 
    resultData.totalScore ?? 
    resultData.correctAnswersCount ?? 
    questionsList.filter(q => q.isCorrect || q.userAnswer === q.correctAnswer).length;

  // Percentage calculation
  const percentage = 
    resultData.percentage ?? 
    (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0);

  const isPassed = percentage >= 60;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title={resultData.title || resultData.quiz?.title || 'Quiz Performance Summary'}
      />

      {/* Main Score Hero Card */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border-2 border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Completed
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {isPassed ? 'Outstanding Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-slate-600 max-w-md text-sm leading-relaxed">
              {isPassed
                ? 'You have demonstrated a strong understanding of this topic. Review your detailed breakdown below.'
                : 'Good effort! Review the correct answers below and try again to improve your score.'}
            </p>
          </div>

          {/* Score Badge Circle */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl min-w-[180px] shadow-lg shadow-emerald-500/20">
            <Trophy className="w-8 h-8 mb-2 opacity-90" />
            <span className="text-4xl font-extrabold">{percentage}%</span>
            <span className="text-xs font-medium text-emerald-100 mt-1">
              {score} / {totalQuestions} Correct
            </span>
          </div>
        </div>
      </div>

      {/* Key Insight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Accuracy</p>
            <p className="text-xl font-bold text-slate-900">{percentage}%</p>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium font-sans">Total Questions</p>
            <p className="text-xl font-bold text-slate-900">{totalQuestions}</p>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status</p>
            <p className={`text-xl font-bold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPassed ? 'Passed' : 'Needs Review'}
            </p>
          </div>
        </div>
      </div>

      {/* Question Review Section */}
      {questionsList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Detailed Breakdown
          </h3>

          <div className="space-y-4">
            {questionsList.map((q, index) => {
              const isCorrect = q.isCorrect ?? (q.userAnswer === q.correctAnswer);

              return (
                <div
                  key={q._id || q.id || index}
                  className={`bg-white/80 border-2 rounded-2xl p-6 shadow-sm transition-all ${
                    isCorrect ? 'border-emerald-200/80' : 'border-rose-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-sm font-semibold text-slate-500">
                      Question {index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-slate-900 font-semibold mb-4 text-base">
                    {q.question || q.questionText || q.text}
                  </p>

                  <div className="space-y-2 text-sm">
                    {q.userAnswer !== undefined && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Your Answer:</span>
                        <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {q.userAnswer}
                        </span>
                      </div>
                    )}

                    {(!isCorrect || !q.userAnswer) && q.correctAnswer && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between">
                        <span className="text-emerald-700 font-medium">Correct Answer:</span>
                        <span className="font-semibold text-emerald-800">
                          {q.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <Button
          onClick={() => navigate(`/quizzes/${quizId}/take`)}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizResultPage;
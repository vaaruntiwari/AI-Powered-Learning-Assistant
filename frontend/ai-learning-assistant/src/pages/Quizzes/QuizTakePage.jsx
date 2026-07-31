import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const QuizTakePage = () => {
  const params = useParams();
  // Safe fallback to match either :quizId or :id parameter in router
  const quizId = params.quizId || params.id;

  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        toast.error('Invalid Quiz ID');
        setLoading(false);
        return;
      }

      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error('Failed to fetch quiz.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length === 0) {
      toast.error('Please answer at least one question before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      // Formats answers exactly as required by backend (matching video implementation)
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const question = quiz.questions.find((q) => q._id === questionId);
        const questionIndex = quiz.questions.findIndex((q) => q._id === questionId);
        const optionIndex = selectedAnswers[questionId];
        const selectedAnswer = question.options[optionIndex];

        return {
          questionIndex,
          selectedAnswer,
        };
      });

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success('Quiz submitted successfully!');
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to submit quiz.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">
            Quiz not found or has no questions.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title={quiz.title || 'Take Quiz'} />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-slate-500">
            {answeredCount} answered
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quiz.questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl mb-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-emerald-700">
              Question {currentQuestionIndex + 1}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion._id] === index;

            return (
              <label
                key={index}
                onClick={() =>
                  handleOptionChange(currentQuestion._id, index)
                }
                className={`group relative flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-500/10'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={index}
                    checked={isSelected}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSelected
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-700'
                    }`}
                  >
                    {option}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || submitting}
            className="flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            Previous
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="flex items-center gap-1.5"
            >
              Next
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Navigation Dots */}
      <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
        {quiz.questions.map((q, index) => {
          const isAnswered = selectedAnswers.hasOwnProperty(q._id);
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`w-9 h-9 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTakePage;
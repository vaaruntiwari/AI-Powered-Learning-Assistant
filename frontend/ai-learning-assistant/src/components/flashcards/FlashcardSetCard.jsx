import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp, Trash2 } from 'lucide-react';
import moment from 'moment';

const FlashcardSetCard = ({ flashcardSet, onDelete }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    const documentId =
      typeof flashcardSet?.documentId === 'object'
        ? flashcardSet.documentId?._id
        : flashcardSet?.documentId;

    if (documentId) {
      // Reverted back to your original flashcards route
      navigate(`/flashcards/${documentId}`);
    } else {
      console.error('No documentId found:', flashcardSet);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevents triggering handleStudyNow when clicking Delete
    if (onDelete) {
      onDelete(flashcardSet);
    }
  };

  const reviewedCount =
    flashcardSet?.cards?.filter((card) => card.lastReviewed)?.length || 0;
  const totalCards = flashcardSet?.cards?.length || 0;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      onClick={handleStudyNow}
      className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header Section */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 flex-shrink-0">
            <BookOpen className="w-5 h-5" strokeWidth={2} />
          </div>

          <div className="flex-1 text-right min-w-0">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {flashcardSet?.title || flashcardSet?.documentId?.title || 'Study Guide'}
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 mt-0.5 block">
              CREATED {flashcardSet?.createdAt ? moment(flashcardSet.createdAt).fromNow() : 'Recently'}
            </span>
          </div>

          {/* Delete Icon Button */}
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              title="Delete Flashcard Set"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              {totalCards} Cards
            </span>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-2.5 text-center border border-emerald-100/60 flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">
              {progressPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Action */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Progress</span>
            <span>
              {reviewedCount}/{totalCards} reviewed
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="w-full py-2.5 px-4 bg-emerald-50 group-hover:bg-emerald-500 text-emerald-700 group-hover:text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Study Now
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
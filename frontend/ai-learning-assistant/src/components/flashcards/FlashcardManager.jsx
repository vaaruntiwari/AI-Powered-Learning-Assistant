import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  // Support Left/Right Arrow keyboard navigation during review
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedSet) return;
      if (e.key === "ArrowLeft") handlePrevCard();
      if (e.key === "ArrowRight") handleNextCard();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSet, currentCardIndex]);

  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      const validData = Array.isArray(response) ? response : response?.data || [];
      setFlashcardSets(validData);
    } catch (error) {
      console.error("Failed to fetch flashcard sets:", error);
      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      setGenerating(true);
      const newSet = await aiService.generateFlashcards(documentId);
      if (newSet && (newSet._id || newSet.id)) {
        setFlashcardSets((prev) => [newSet, ...prev]);
        toast.success("Flashcards generated successfully!");
      } else {
        await fetchFlashcardSets();
      }
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
      toast.error("Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSet = (set) => {
    if (!set?.cards || set.cards.length === 0) {
      toast.error("This set contains no cards.");
      return;
    }
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const handleDeleteRequest = async (e, set) => {
    e.stopPropagation();

    const setId = set?._id || set?.id;

    if (!setId) {
      toast.error("Invalid flashcard set ID.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this flashcard set?")) return;

    try {
      await flashcardService.deleteFlashcardSet(setId);
      setFlashcardSets((prev) => prev.filter((s) => (s._id || s.id) !== setId));

      if ((selectedSet?._id || selectedSet?.id) === setId) {
        setSelectedSet(null);
      }
      toast.success("Flashcard set deleted.");
    } catch (error) {
      console.error("Failed to delete flashcard set:", error);
      toast.error("Failed to delete set.");
    }
  };

  const cardsList = selectedSet?.cards || [];
  const totalCards = cardsList.length;

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const renderFlashcardViewer = () => {
    const currentCard = cardsList[currentCardIndex];
    const progressPercentage =
      totalCards > 0 ? Math.round(((currentCardIndex + 1) / totalCards) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Top bar with back button & progress counter */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={() => setSelectedSet(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sets
          </button>

          <div className="flex items-center gap-3 select-none">
            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {totalCards > 0 ? currentCardIndex + 1 : 0} / {totalCards} Cards
            </span>
          </div>
        </div>

        {/* Card Display */}
        {currentCard ? (
          <div className="flex justify-center my-6">
            <Flashcard flashcard={currentCard} />
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            No cards found in this set.
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 select-none">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>Tip: Press</span>
            <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">←</kbd>
            <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">→</kbd>
            <span>to navigate</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="flex items-center gap-1 px-4 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm text-sm font-medium text-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-lg border border-emerald-200">
              {progressPercentage}% Completed
            </div>

            <button
              onClick={handleNextCard}
              disabled={currentCardIndex >= totalCards - 1}
              className="flex items-center gap-1 px-4 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/20 text-sm font-medium cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (!flashcardSets || flashcardSets?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-4">
            <Brain className="w-8 h-8 text-emerald-600" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm">
            Generate flashcards from your document to start learning and
            reinforce your knowledge.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              "Generating..."
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between select-none">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Flashcard Sets
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {flashcardSets?.length || 0}{" "}
              {flashcardSets?.length === 1 ? "set" : "sets"} available
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-5 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              "Generating..."
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets?.map((set, index) => (
            <div
              key={set._id || set.id || index}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer select-none"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100">
                  <Brain className="w-6 h-6 text-emerald-600" strokeWidth={2} />
                </div>

                <div>
                  <h4 className="text-base font-semibold text-slate-900 mb-1">
                    Flashcard Set
                  </h4>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="text-sm font-semibold text-emerald-700">
                      {set?.cards?.length || 0}{" "}
                      {set?.cards?.length === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
      {selectedSet ? renderFlashcardViewer() : renderSetList()}
    </div>
  );
};

export default FlashcardManager;
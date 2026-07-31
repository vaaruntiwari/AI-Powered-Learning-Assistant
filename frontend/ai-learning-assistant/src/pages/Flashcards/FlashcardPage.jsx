import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id } = useParams();

  const [flashcardSets, setFlashcardSets] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch flashcard set
 const fetchFlashcards = async () => {
  if (!id) return;

  setLoading(true);

  try {
    const response = await flashcardService.getFlashcardsForDocument(id);

    console.log("Response:", response);

    // response = { success, count, data }
    const sets = response.data || [];

    console.log("Sets:", sets);

    if (!Array.isArray(sets)) {
      setFlashcards([]);
      setFlashcardSets(null);
      return;
    }

    const matchingSet =
      sets.find((set) => set.documentId?._id === id) ||
      sets.find((set) => set.documentId?.toString() === id) ||
      sets.find((set) => set.documentId === id) ||
      sets[0];

    console.log("Matching Set:", matchingSet);

    if (!matchingSet) {
      setFlashcardSets(null);
      setFlashcards([]);
      return;
    }

    console.log("Cards:", matchingSet.cards);

    setFlashcardSets(matchingSet);
    setFlashcards(matchingSet.cards || []);
    setCurrentCardIndex(0);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch flashcards");
    setFlashcards([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchFlashcards();
  }, [id]);

  // AI Generation
  const handleGenerateFlashcards = async () => {
    const targetDocumentId =
      flashcardSets?.documentId?._id || flashcardSets?.documentId || id;

    setGenerating(true);
    try {
      await aiService.generateFlashcards(targetDocumentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // Card Controls
  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleReview = async (index) => {
    const currentCard = flashcards[index];
    if (!currentCard?._id) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
    } catch (error) {
      console.error("Review error:", error);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
    } catch (error) {
      toast.error("Failed to toggle star.");
    }
  };

  // Delete Set
  const handleDeleteFlashcardSet = async () => {
    const setId = flashcardSets?._id || id;
    if (!setId) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setId);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete set.");
    } finally {
      setDeleting(false);
    }
  };

  const backDocumentId =
    typeof flashcardSets?.documentId === "object"
      ? flashcardSets?.documentId?._id
      : flashcardSets?.documentId || id;

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div>
        <Link
          to={`/documents/${backDocumentId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to Document
        </Link>

        <PageHeader
          title={flashcardSets?.title || "Flashcards"}
          subtitle="Review and practice key concepts from your document"
          action={
            <div className="flex items-center gap-3">
              {!loading && flashcards.length > 0 && (
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  variant="secondary"
                  disabled={deleting}
                  className="text-red-600 hover:bg-red-50 hover:border-red-200"
                >
                  <Trash2 size={16} /> Delete Set
                </Button>
              )}

              <Button
                onClick={handleGenerateFlashcards}
                loading={generating}
              >
                <Sparkles size={16} />
                {flashcards.length > 0 ? "Regenerate AI Cards" : "Generate AI Cards"}
              </Button>
            </div>
          }
        />
      </div>

      {/* Main Content View */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : flashcards.length > 0 && currentCard ? (
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="w-full max-w-md">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePrevCard}
              variant="secondary"
              disabled={flashcards.length <= 1}
            >
              <ChevronLeft size={16} /> Previous
            </Button>

            <span className="text-sm font-medium text-slate-600">
              {currentCardIndex + 1} / {flashcards.length}
            </span>

            <Button
              onClick={handleNextCard}
              variant="secondary"
              disabled={flashcards.length <= 1}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards from your document to start learning."
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this set of flashcards? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteFlashcardSet}
              loading={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;
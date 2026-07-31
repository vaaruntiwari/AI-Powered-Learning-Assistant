import React, { useState, useEffect } from 'react';
import flashcardService from '../../services/flashCardService';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Delete States
  const [selectedSetToDelete, setSelectedSetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcardSets = async () => {
    try {
      const response = await flashcardService.getAllFlashcardSets();
      setFlashcardSets(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch flashcard sets.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  // Opens the modal for the clicked flashcard set
  const handleDeleteClick = (set) => {
    setSelectedSetToDelete(set);
  };

  // Handles deleting the set via service call and updates UI state
  const handleConfirmDelete = async () => {
    if (!selectedSetToDelete) return;

    // Checks set._id or set.id
    const targetId = selectedSetToDelete._id || selectedSetToDelete.id;

    if (!targetId) {
      toast.error('Invalid flashcard set ID.');
      return;
    }

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(targetId);
      
      toast.success('Flashcard set deleted successfully!');

      // Remove the deleted set from the state immediately
      setFlashcardSets((prevSets) =>
        prevSets.filter((s) => (s._id || s.id) !== targetId)
      );

      setSelectedSetToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        error.response?.data?.message || error.message || 'Failed to delete flashcard set.'
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="All Flashcard Sets" />

      {flashcardSets.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          No flashcard sets found. Create one from your documents page!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {flashcardSets.map((set) => (
            <FlashcardSetCard
              key={set._id || set.id}
              flashcardSet={set}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(selectedSetToDelete)}
        onClose={() => !deleting && setSelectedSetToDelete(null)}
        title="Delete Flashcard Set"
      >
        <p className="text-sm text-neutral-600 mb-6">
          Are you sure you want to delete this set of flashcards? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSelectedSetToDelete(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardsListPage;
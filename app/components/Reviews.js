'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from '../components/Loading';
import ConfirmDialog from "./ConfirmDialog";

const Reviews = ({ id }) => {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isDeleteReviewDialogOpen, setIsDeleteReviewDialogOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Értékelések lekérése
  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${id}`);
      if (!response.ok) {
        throw new Error("Nem sikerült lekérni az értékeléseket");
      }

      const data = await response.json();

      // Adatok ellenőrzése és feldolgozása
      if (Array.isArray(data)) {
        setReviews(data);
      } else if (data && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Hiba történt az értékelések lekérésekor:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Szerkesztés elindítása
  const handleUpdate = (feedback_id) => {
    const reviewToEdit = reviews.find((rev) => rev.feedback_id === feedback_id);
    if (reviewToEdit) {
      setEditReviewId(feedback_id);
      setNewComment(reviewToEdit.comment || "");
    }
  };

  // Módosítások mentése
  const handleSave = async (feedback_id) => {
    if (!newComment.trim()) {
      return; // Üres kommentek elkerülése
    }
    
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment, feedback_id })
      });

      if (!response.ok) {
        throw new Error('Nem sikerült frissíteni az értékelést');
      }

      // Optimista UI frissítés
      setReviews(prevReviews =>
        prevReviews.map((rev) =>
          rev.feedback_id === feedback_id ? { ...rev, comment: newComment } : rev
        )
      );

      setEditReviewId(null);
      setNewComment("");
    } catch (error) {
      console.error("Error whle updating:", error);
      setError(error.message);
    }
  };


  const closeDialog = () => {
    setIsDeleteReviewDialogOpen(false)
  }
  const handleDeleteRequest = (reviewId) => {
    setReviewIdToDelete(reviewId);
    setIsDeleteReviewDialogOpen(true);
  }
  // Értékelés törlése
  const handleDelete = async (feedback_id) => {
    
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback_id }) // JSON objektumot küldünk
      });

      if (!response.ok) {
        throw new Error('Error deleting review');
      }

      // Optimista UI frissítés
      setReviews(prevReviews => prevReviews.filter((rev) => rev.feedback_id !== feedback_id));
      setIsDeleteReviewDialogOpen(false)
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  // Szerkesztés megszakítása
  const handleCancelEdit = () => {
    setEditReviewId(null);
    setNewComment("");
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Page change handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination number display logic
  const getPaginationNumbers = () => {
    let pages = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than max visible, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More complex logic for many pages
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust when near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500 mt-2 text-center">Error: {error}</p>;
  }

  if (!reviews.length) {
    return <div className="text-center py-4">There are no reviews yet...</div>;
  }

  return (
    <div className="flex flex-col space-y-6">
      {isDeleteReviewDialogOpen && (
          <ConfirmDialog title="Confirm Delete Review" message="Are you sure you want to delete your review?" onClose={closeDialog} handle={() => handleDelete(reviewIdToDelete)}/>
        )}
      {/* Reviews list */}
      {currentReviews.map((review) => (
       
        <div className="flex flex-col border-b-2 pb-4" key={review.feedback_id}>
          {/* Értékelés csillagok */}
          {review.rating &&
          <div className="text-yellow-500 text-2xl mb-1">
            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
          </div>
          } 

          {/* Felhasználónév */}
          <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
  <span className="font-medium text-gray-800">{review.users.username}</span>
  <span className="text-gray-500">•</span>
  <span>{review.created_at.split('T')[0]}</span>
</div>

          {/* Komment tartalma vagy szerkesztő mezője */}
          <div className="mb-3">
            {editReviewId === review.feedback_id ? (
              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                  rows="3"
                  placeholder="Írd be az értékelést..."
                />
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={handleCancelEdit} 
                    className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
                  >
                    Mégsem
                  </button>
                  <button 
                    onClick={() => handleSave(review.feedback_id)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    disabled={!newComment.trim()}
                  >
                    Mentés
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800">{review.comment}</p>
            )}
          </div>

          {/* Műveletek gombjai saját értékelésnél */}
          {session && session.user.username === review.users.username && editReviewId !== review.feedback_id &&(
            <div className="flex justify-end space-x-4">
              { review.comment &&
                <button 
                onClick={() => handleUpdate(review.feedback_id)} 
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              }
              <button 
                onClick={() => handleDeleteRequest(review.feedback_id)} 
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
          >
            &laquo;
          </button>
          
          {getPaginationNumbers().map(number => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
          >
            &raquo;
          </button>
          
          <span className="text-sm text-gray-600 ml-2">
            {currentPage} / {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default Reviews;
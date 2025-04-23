'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ReviewsForm = ({ id }) => {
  const { data: session, status } = useSession();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hovered, setHovered] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      setUserId(session.user.id);
    }
  }, [session]);

  const handleMouseEnter = (index) => {
    setHovered(index);
  };

  const handleMouseLeave = () => {
    setHovered(0);
  };

  const handleClick = (index) => {
    setRating(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, comment, rating })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting review");
      }

      // Success handling
      setComment("");
      setRating(0);
      window.location.reload();
    } catch (error) {
      console.error("Review submission error:", error);
      setError(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-4">
        Please sign in to leave a review
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full pb-10">
      <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
        <h3 className="text-lg font-medium">Write a Review</h3>
        
        {/* Rating stars */}
        <div className="flex items-center">
          <div className="mr-2 text-sm">Rating:</div>
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              className={`cursor-pointer transition-all duration-200 ${
                rating >= star ? 'transform scale-110' : ''
              }`}
              fill={(hovered >= star || rating >= star) ? '#FFC107' : '#E0E0E0'}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(star)}
            >
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>

        {/* Review text area */}
        <div className="w-full">
          <textarea
            value={comment || ''}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none min-h-24 resize-none"
            placeholder="Write your review here..."
            rows="4"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewsForm;
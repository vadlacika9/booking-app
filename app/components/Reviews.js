'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from '../components/Loading';

const Reviews = ({ id }) => {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);  // Az éppen szerkesztett vélemény ID-ja
  const [newComment, setNewComment] = useState("");  // A szerkesztett vélemény új kommentje

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // fetching reviews
  const fetchReviews = async () => {
    try {
      const getReviews = await fetch(`/api/reviews/${id}`);
      if (!getReviews.ok) {
        throw new Error("Cannot get reviews");
      }

      const data = await getReviews.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setReviews(data);
      } else if (Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // handling edit comment
  const handleUpdate = async (feedback_id) => {
    setEditReviewId(feedback_id);  
    const reviewToEdit = reviews.find((rev) => rev.feedback_id === feedback_id);
    if (reviewToEdit) {
      setNewComment(reviewToEdit.comment); 
    }
  };

  // handling saving comment
  const handleSave = async (feedback_id) => {
    try {
      const updateReview = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment, feedback_id })  // saving the modified comment
      });

      if (!updateReview.ok) {
        throw new Error('Cannot update review');
      }

      setReviews(prevReviews =>
        prevReviews.map((rev) =>
          rev.feedback_id === feedback_id ? { ...rev, comment: newComment } : rev
        )
      );

      setEditReviewId(null);  //exit edit mode
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  // handling delete
  const handleDelete = async (feedback_id) => {
    try {
      const deleteReview = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback_id)
      });

      if (!deleteReview.ok) {
        throw new Error('Cannot delete review');
      }

      setReviews(prevReviews => prevReviews.filter((rev) => rev.feedback_id !== feedback_id));
    } catch (error) {
      console.log(error);
    }
  };


  if (loading) {
    return <Loading />;
  }


  if (error) {
    return  <p className="text-red-500 mt-2 text-center">{error}</p>}
  


  if (!reviews.length) {
    return <div>There are no reviews</div>;
  }

  return (
    <div className="flex flex-col">
      {reviews.map((rev, index) => (
        <div className="flex flex-col border-b-2 mb-10" key={index}>
          {/* stars */}
          <div className="text-yellow-500 text-4xl">
            {"★".repeat(rev.rating)}
          </div>

          {/* username */}
          <div className="pb-4">by {rev.users.username}</div>

          {/* comment */}
          <div>
            {editReviewId === rev.feedback_id ? (
              <div>
                {/* editable form */}
                <textarea
                  value={newComment ?? ''}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <div className="flex justify-end mt-2">
                  <button onClick={() => handleSave(rev.feedback_id)} className="text-blue-500 mr-4">Save</button>
                  <button onClick={() => setEditReviewId(null)} className="text-gray-500">Cancel</button>
                </div>
              </div>
            ) : (
              <div>{rev.comment}</div>
            )}
          </div>

          {/* buttons */}
          {session && session.user.username === rev.users.username && (
            <div className="flex justify-end text-red-500">
              <div onClick={() => handleUpdate(rev.feedback_id)} className="mr-4 cursor-pointer">update</div>
              <div onClick={() => handleDelete(rev.feedback_id)} className="cursor-pointer">delete</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reviews;

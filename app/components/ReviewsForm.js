'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ReviewsForm = ({id}) => {
  const { data: session, status } = useSession();
  const [comment, setComment] = useState(null);
  const [rating, setRating] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
   const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if(session){
      setUserId(session.user.id)
    }
  },[session])

  const handleMouseEnter = (index) => {
    setHovered(index);
  };

  const handleMouseLeave = () => {
    setHovered(0);
  };

  const handleClick = (index) => {
    setRating(index);
  };

  const handleSubmit = (e) => {

    try{
      const sendReview = fetch(`/api/reviews/${id}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId, comment, rating})
      })

      if(!sendReview){
        throw new Error("error while sending feedback")
      }
    }catch(error){
      setError(error)
    }
    e.preventDefault();
    console.log({ comment, rating });
    alert("Review submitted!");

    setComment("");
    setRating(5);
    window.location.reload();


  };

  return (
    <div className="flex justify-center items-center w-full pb-10">
      <form onSubmit={handleSubmit} className="flex flex-col  w-full">
        <div className="flex w-full">
          
          <textarea
            value={comment ?? ''}
            onChange={(e) => setComment(e.target.value)}
            className="w-full py-2 mr-20 rounded-lg outline-none border-none overflow-hidden resize-none"
            placeholder="Write your review here..."
            
          />
        </div>
        <div className="flex gap-4">
        <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          className="cursor-pointer transition-all duration-200"
          fill={(hovered >= star || rating >= star) ? '#FFC107' : '#E0E0E0'} // Using fill property for color
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
        
        <button
          type="submit"
          className=" bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Review
        </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  )
}

export default ReviewsForm;
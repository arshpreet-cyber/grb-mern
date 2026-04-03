'use client';

import { useEffect, useState } from 'react';

// This tells TypeScript what a review looks like
type Review = {
  id: number;
  rating: number;
  content: string;
  authorName: string;
};

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  // Fetch all reviews from our backend API when the page loads
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  // Send a new review to the backend API when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName, rating: Number(rating), content }),
    });

    if (res.ok) {
      const savedReview = await res.json();
      setReviews([savedReview, ...reviews]); // Add new review to the UI instantly
      setAuthorName(''); // Clear the form
      setContent('');
      setRating(5);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-10 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center">GetReviews</h1>
      
      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 text-black">
        <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
        
        <input 
          type="text" 
          placeholder="Your Name" 
          value={authorName} 
          onChange={(e) => setAuthorName(e.target.value)} 
          className="w-full mb-3 p-2 border rounded"
          required 
        />
        
        <select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        
        <textarea 
          placeholder="What did you think?" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          className="w-full mb-3 p-2 border rounded h-24"
          required 
        />
        
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          Submit Review
        </button>
      </form>

      {/* Review List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg shadow-sm bg-white text-black">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{review.authorName}</h3>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  {review.rating} Stars
                </span>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
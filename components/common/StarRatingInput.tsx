import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
    rating: number;
    setRating: (rating: number) => void;
    size?: number;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating, size = 32 }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map(star => (
                <button 
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                >
                    <Star
                        size={size}
                        className={`transition-colors duration-200 ${
                            hoverRating >= star || rating >= star
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRatingInput;

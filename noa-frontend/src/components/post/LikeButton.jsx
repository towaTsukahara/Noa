import { useState } from "react";
import "./LikeButton.css";

function LikeButton({ initialCount = 0 }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    if (liked) {
      setCount(count - 1);
    } else {
      setCount(count + 1);
    }

    setLiked(!liked);
  };

  return (
    <button className={`like-button ${liked ? "liked" : ""}`} onClick={handleClick}>
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}

export default LikeButton;

import { useState } from "react";

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
    <button onClick={handleClick}>
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}

export default LikeButton;
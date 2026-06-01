import { useEffect, useState } from 'react';
import { api } from '../api/client';

function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api('/timeline')
      .then((data) => setPosts(data.items))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>タイムライン</h1>
      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <p>{post.body}</p>
          <small>♡ {post.likeCount}</small>
        </div>
      ))}
    </div>
  );
}

export default TimelinePage;
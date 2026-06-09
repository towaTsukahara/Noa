//名前変更予定
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TagDetailPage() {

    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);

    const { tagId } = useParams();
    const navigate = useNavigate();

    const fetchTag = async () => {
        try {
            const response = await fetch(`/api/v1/tags/${tagId}`, { credentials: "include", });

            if (!response.ok) {
                throw new Error("取得失敗");
            }

            const data = await response.json();

            setTag(data);

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTag();
    }, [tagId]);

    if (loading) {
        return <div>読み込み中...</div>;
    }

    if (!tag) {
        return <div>タグが見つかりません</div>
    }

    const toggleFollow = async () => {
        try {
            const response = await fetch(
                `/api/v1/tags/${encodeURIComponent(tag.name)}/follow`,
                { method: tag.followed ? "DELETE" : "POST" , credentials: "include", }
            );

            if (!response.ok) {
                throw new Error();
            }

            fetchTag();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>{tag.name}</h1>
            <button onClick={toggleFollow}>
                {tag.followed ? "フォローをやめる" : "フォローする"}
            </button>

            <hr />

            <h2>タグが付いた投稿</h2>
            {tag.posts.map((post) => (
                <div 
                    key={post.id}
                    onClick={() => navigate(`/posts/${post.id}`)}
                    style={{ cursor: "pointer" }}
                >
                    <div>{post.body}</div>
                    <hr />
                </div>
            ))}
        </div>
    )
}
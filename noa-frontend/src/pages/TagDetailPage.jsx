//名前変更予定
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { relativeTime } from "../utils/relativeTime";
import UserHandle from "../components/user/UserHandle";

import "./TimelinePage.css";

export default function TagDetailPage() {

    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);

    const { tagId } = useParams();

    const fetchTag = async () => {

        setLoading(true);

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
                { method: tag.followed ? "DELETE" : "POST", credentials: "include", }
            );

            if (!response.ok) {
                throw new Error();
            }

            fetchTag();

        } catch (error) {
            console.error(error);
        }
    };

    const handleLikeToggle = async (post) => {
        try {
            const response = await fetch(
                `/api/v1/posts/${post.id}/like`,
                {
                    method: post.likedByMe ? "DELETE" : "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("いいね失敗");
            }

            setTag((prev) => ({
                ...prev,
                posts: prev.posts.map((p) =>
                    p.id === post.id
                        ? {
                            ...p,
                            likedByMe: !p.likedByMe,
                            likeCount: p.likedByMe
                                ? p.likeCount - 1
                                : p.likeCount + 1,
                        }
                        : p
                ),
            }));

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
            {tag.posts?.map((post) => (
                <article
                    key={post.id}
                    className="post-card"
                >
                    <div className="post-header">
                        <div className="avatar"></div>

                        <div>
                            <div className="nickname">
                                <Link
                                    to={`/users/${post.author?.handle}`}
                                >
                                    {post.author && (
                                        <UserHandle user={post.author} />
                                    )}
                                </Link>
                            </div>

                            <div className="date">
                                {relativeTime(
                                    post.createdAt
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="content">
                        {post.body}
                    </p>

                    <Link
                        to={`/post/${post.id}`}
                        className="post-detail-link"
                    >
                        詳細...
                    </Link>

                    <div className="tags">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                style={{ cursor: "pointer" }}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="actions">
                        <button
                            onClick={() => handleLikeToggle(post)}
                        >
                            {post.likedByMe ? "♥" : "♡"}
                            {" "}
                            {post.likeCount}
                        </button>

                        <span>
                            💬 {post.replyCount}
                        </span>
                    </div>
                </article>
            ))}
        </div>
    )
}
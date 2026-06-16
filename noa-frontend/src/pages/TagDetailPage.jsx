//名前変更予定
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { relativeTime } from "../utils/relativeTime";
import heart_filled from '/icons/heart_filled.svg';
import heart from '/icons/heart.svg';
import reply from '/icons/reply.svg';

import "./TagDetailPage.css";

export default function TagDetailPage() {

    const [tag, setTag] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const { tagId } = useParams();
    const selectedId = searchParams.get("post"); // 今開いている投稿id（文字列）

    // 投稿を右パネルで開く（?post=123 を付ける）
    const openDetail = (postId) => {
        const next = new URLSearchParams(searchParams);
        next.set("post", postId);
        setSearchParams(next);
    };

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
        <div className="tag-detail page">
            <div className="tag-hero">

                <div className="tag-hero-name">
                    #{tag.name}
                </div>

                <div className="tag-hero-desc">
                    このタグが付いた投稿を、新着順で表示します
                </div>

                <button
                    className={`btn ${tag.followed ? "btn-ghost" : ""}`}
                    onClick={toggleFollow}
                >
                    {tag.followed
                        ? "フォロー中 ✓"
                        : "フォローする"}
                </button>

            </div>

            {tag.posts?.length === 0 && (
                <p className="empty-note">
                    このタグの投稿はまだありません。
                </p>
            )}

            {tag.posts?.map((post) => (
                <article
                    key={post.id}
                    className={`mini-post ${String(selectedId) === String(post.id) ? "is-selected" : ""}`}
                    onClick={() => openDetail(post.id)}
                >
                    <div className="search-date">
                        {relativeTime(post.createdAt)}
                    </div>

                    <div className="search-snippet">
                        {post.body}
                    </div>

                    <div className="tags">
                        {post.tags?.map((tag) => (
                            <span key={tag.id}>
                                #{tag.name}
                            </span>
                        ))}
                    </div>

                    <div className="actions">
                        <button
                            className={`like-button ${post.likedByMe ? "liked" : ""}`}
                            onClick={(e) => { e.stopPropagation(); handleLikeToggle(post); }}
                        >
                            <img
                                src={post.likedByMe ? heart_filled : heart}
                                alt="いいね"
                                className="icon-like"
                            />
                            <span>{post.likeCount}</span>
                        </button>
                        <span className="reply">
                            <img src={reply} alt="返信" className="icon-reply" />
                            <span>{post.replyCount}</span>
                        </span>
                    </div>
                </article>
            ))}
        </div>
    );
}

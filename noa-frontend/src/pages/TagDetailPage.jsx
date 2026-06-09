//名前変更予定
import { useState } from "react";
import { useParams } from "react-router-dom";
import { POSTS, TAGS } from "../date/mockData";
import "./TagDetailPage.css";

export default function TagDetailPage() {
    const { tagId } = useParams();

    const tag = TAGS.find((tag) => tag.id === Number(tagId));

    const [isFollowed, setIsFollowed] = useState(false);

    const relatedPosts = POSTS.filter((post) =>
        tag && post.tags.includes(tag.name)
    );

    if (!tag) {
        return <div className="tag-detail page"><p className="empty-note">not found 404</p></div>;
    }

    return (
        <div className="tag-detail page">
            <div className="tag-hero">
                <div className="tag-hero-name">#{tag.name}</div>
                <div className="tag-hero-desc">このタグが付いた投稿を、新着順で表示します</div>
                <button
                    className={`btn ${isFollowed ? "btn-ghost" : ""}`}
                    onClick={() => setIsFollowed(!isFollowed)}
                >
                    {isFollowed ? "フォロー中 ✓" : "このトピックをフォロー"}
                </button>
            </div>

            <div className="section-title">投稿</div>
            {relatedPosts.length === 0 && <p className="empty-note">このトピックの投稿はまだありません。</p>}
            {relatedPosts.map((post) => (
                <div key={post.id} className="mini-post">
                    <div className="search-title">{post.title}</div>
                    <div className="search-snippet">{post.content}</div>
                </div>
            ))}
        </div>
    );
}

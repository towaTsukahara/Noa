import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import "./PostDetailPage.css";

import LikeButton from "../components/post/LikeButton";
import CommentList from "../components/post/CommentList";
import CommentForm from "../components/post/CommentForm";

const dummyPosts = [
    {
        id: 1,
        author: "Noa-001",
        body: "Spring Bootで@Transactionalの境界、サービス層に付けるかリポジトリ層か、みんなどうしてる？",
        tags: ["spring boot", "質問"],
        likeCount: 2,
        comments: [],
    },
    {
        id: 2,
        author: "Noa-002",
        body: "ReactのuseEffectの依存配列、ESLintのexhaustive-depsを入れてから事故が減った。",
        tags: ["react"],
        likeCount: 1,
        comments: [],
    },
    {
        id: 21,
        author: "Noa-003",
        body: "EXPLAIN ANALYZE が読めるようになると、遅いクエリの原因がすぐ分かる。",
        tags: ["postgresql"],
        likeCount: 4,
        comments: [
            {
                id: 1,
                author: "Noa-001",
                body: "実行計画を読むの大事ですよね。",
                mine: false,
            },
            {
                id: 2,
                author: "Noa-002",
                body: "最近勉強し始めました！",
                mine: false,
            },
            {
                id: 3,
                author: "自分",
                body: "勉強になります！",
                mine: true,
            },
        ],
    },
];

function PostDetailPage() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await api(`/posts/${id}`);
                setPost(data);

                const commentsData = await api(`/comments?postId=${id}`);

                setComments(
                    commentsData.map((comment) => ({
                        id: comment.id,
                        author: comment.authorName,
                        body: comment.body,
                        mine: false,
                    }))
                );
            } catch (error) {
                console.error("投稿取得失敗", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleAddComment = async (text) => {
        try {
            await api(`/comments`, {
                method: "POST",
                body: JSON.stringify({
                    postId: Number(id),
                    body: text,
                }),
            });

            const commentsData = await api(`/comments?postId=${id}`);

            setComments(
                commentsData.map((comment) => ({
                    id: comment.id,
                    author: comment.authorName,
                    body: comment.body,
                    mine: false,
                }))
            );
        } catch (error) {
            console.error("コメント投稿失敗", error);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(
            comments.filter((comment) => comment.id !== commentId)
        );
    };

    if (loading) {
        return <div className="post-detail page"><p className="empty-note">読み込み中...</p></div>;
    }

    if (!post) {
        return <div className="post-detail page"><p className="empty-note">投稿が見つかりません</p></div>;
    }

    return (
        <div className="post-detail page">
            <div className="page-pad detail-main">
                <div className="detail-author">
                    <span className="user-handle">{post.author.handle}</span>
                </div>

                <p className="detail-body">{post.body}</p>

                <div className="detail-tags">
                    {post.tags.map((tag) => (
                        <span key={tag} className="tag">#{tag}</span>
                    ))}
                </div>

                <div className="detail-actions">
                    <LikeButton initialCount={post.likeCount} />
                </div>
            </div>

            <CommentList
                comments={comments}
                onDeleteComment={handleDeleteComment}
            />

            <CommentForm onAddComment={handleAddComment} />
        </div>
    );
}

export default PostDetailPage;

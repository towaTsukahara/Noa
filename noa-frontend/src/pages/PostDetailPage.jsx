import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

import LikeButton from "../components/post/LikeButton";
import CommentList from "../components/post/CommentList";
import CommentForm from "../components/post/CommentForm";

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
        return <h2>読み込み中...</h2>;
    }

    if (!post) {
        return <h2>投稿が見つかりません</h2>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>投稿詳細</h2>

            <p>
                <strong>{post.author.handle}</strong>
            </p>

            <p>{post.body}</p>

            <div>
                {post.tags.map((tag) => (
                    <span
                        key={tag}
                        style={{
                            border: "1px solid #ccc",
                            padding: "4px 8px",
                            marginRight: "8px",
                            borderRadius: "20px",
                        }}
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            <div style={{ marginTop: "20px" }}>
                <LikeButton initialCount={post.likeCount} />
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
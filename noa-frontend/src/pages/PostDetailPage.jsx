import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

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

                const repliesData = await api(`/posts/${id}/replies`);

                setComments(
                    repliesData.items.map(reply => ({
                        id: reply.id,
                        author: reply.author.handle,
                        body: reply.body,
                        mine: false
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

    const handleAddComment = (text) => {
        const newComment = {
            id: Date.now(),
            author: "自分",
            body: text,
            mine: true,
        };

        setComments([...comments, newComment]);
    };

    const handleDeleteComment = (commentId) => {
        setComments(
            comments.filter(
                (comment) => comment.id !== commentId
            )
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
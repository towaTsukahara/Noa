import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { relativeTime } from "../utils/relativeTime";
import UserHandle from "../components/user/UserHandle";

import "./TimelinePage.css";

export default function SearchPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedTab, setSelectedTab] = useState("posts");
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [followingTags, setFollowingTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const fetchSuggestions = async (value) => {

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`/api/v1/tags?q=${encodeURIComponent(value)}`,
                { credentials: "include", });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            setSuggestions(data.slice(0, 5));

        } catch (error) {
            console.error(error);
        }

    };

    const search = async (word) => {
        try {
            const response = await fetch(
                `/api/v1/search?keyword=${encodeURIComponent(word)}`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error("検索失敗");
            }

            const data = await response.json();

            console.log(data.posts);
            console.log("tags =", data.posts[0]?.tags);

            setPosts(data.posts);
            setTags(data.tags);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async () => {
        setSearchParams({ keyword });

        await search(keyword);
    };

    const handleSuggestionClick = async (tag) => {
        setKeyword(tag.name);
        setSuggestions([]);

        setSearchParams({
            keyword: tag.name,
        });

        await search(tag.name);
    };

    useEffect(() => {
        const keywordFromUrl = searchParams.get("keyword");

        if (keywordFromUrl) {
            setKeyword(keywordFromUrl);
            search(keywordFromUrl);
        }
    }, []);

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

            setPosts((prev) =>
                prev.map((p) =>
                    p.id === post.id
                        ? {
                            ...p,
                            likedByMe: !p.likedByMe,
                            likeCount: p.likedByMe
                                ? p.likeCount - 1
                                : p.likeCount + 1,
                        }
                        : p
                )
            );

        } catch (error) {
            console.error(error);
        }
    };

    const fetchFollowingTags = async () => {
        try {
            const response = await fetch(
                "/api/v1/me/following/tags",
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            setFollowingTags(data.map((tag) => tag.name));

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFollowingTags();
    }, []);

    const toggleFollow = async (tagName) => {
        const isFollowed = followingTags.includes(tagName);

        try {
            const response = await fetch(
                `/api/v1/tags/${encodeURIComponent(tagName)}/follow`,
                {
                    method: isFollowed ? "DELETE" : "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            await fetchFollowingTags();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>検索</h1>

            <input
                type="text"
                placeholder="キーワードを入力"
                value={keyword}
                onChange={(e) => {
                    const value = e.target.value;
                    setKeyword(value);
                    fetchSuggestions(value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />

            <button onClick={handleSearch}>検索</button>

            {suggestions.length > 0 && (
                <div>
                    {suggestions.map((tag) => (
                        <div
                            key={tag.id}
                            onClick={() => handleSuggestionClick(tag)}
                            style={{ cursor: "pointer" }}
                        >
                            {tag.name}
                        </div>
                    ))}
                </div>
            )}

            <div>
                <button onClick={() => setSelectedTab("posts")}>投稿</button>
                <button onClick={() => setSelectedTab("tags")}>タグ</button>
            </div>

            <hr />

            {selectedTab === "posts" ? (
                <div>
                    {posts.map((post) => (
                        <article key={post.id} className="post-card">

                            <div className="post-header">
                                <div className="avatar"></div>

                                <div>
                                    <div className="nickname">
                                        <Link
                                            to={`/users/${post.author?.handle}`}
                                        >
                                            <UserHandle
                                                user={post.author ?? { handle: "Unknown" }}
                                            />
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
                                    <span key={tag.id}>
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>

                            <div className="actions">
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleLikeToggle(post)}>
                                        {post.likedByMe ? "♥" : "♡"} {post.likeCount}
                                    </button>

                                    <span style={{ marginLeft: "12px" }}>
                                        💬 {post.replyCount}
                                    </span>
                                </div>
                            </div>

                        </article>
                    ))
                    }
                </div>
            ) : (
                <div>
                    {tags.map((tag) => {

                        const isFollowed = followingTags.includes(tag.name);

                        return (
                            <div key={tag.id}>
                                <span
                                    onClick={() => navigate(`/tag/${tag.id}`)}
                                    style={{ cursor: "pointer" }}>
                                    {tag.name}
                                </span>

                                <button onClick={() => toggleFollow(tag.name)}>
                                    {isFollowed ? "フォローをやめる" : "フォローする"}
                                </button>

                                <hr />
                            </div>
                        );
                    })}
                </div>
            )}
        </div >
    );
}
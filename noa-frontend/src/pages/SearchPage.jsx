
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { relativeTime } from "../utils/relativeTime";
import UserHandle from "../components/user/UserHandle";
import "./SearchPage.css";

export default function SearchPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedTab, setSelectedTab] = useState("posts");
    const [posts, setPosts] = useState([]);
    const [hasMorePosts, setHasMorePosts] = useState(false);
    const [postLimit, setPostLimit] = useState(10);
    const [tags, setTags] = useState([]);
    const [followingTags, setFollowingTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const searchRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutSide = (event) => {
            if (
                searchRef.current && !searchRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutSide);

        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
        };
    }, []);

    const search = async (word, limit = 10) => {
        try {
            const response = await fetch(
                `/api/v1/search?keyword=${encodeURIComponent(word)}&limit=${limit}`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error("検索失敗");
            }

            const data = await response.json();

            console.log(data.posts);
            console.log("tags =", data.posts[0]?.tags);

            console.log("posts =", data.posts);

            console.log("response", data);
            console.log("hasMorePosts", data.hasMorePosts);

            data.posts.forEach((post) => {
                console.log("post", post.id);
                console.log("replyCount", post.replyCount);
                console.log("tags", post.tags);
            });

            setPosts(data.posts);
            setTags(data.tags);
            setHasMorePosts(data.hasMorePosts);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchRecentPosts = async (limit = 10) => {
        try {
            const response = await fetch(
                `/api/v1/search/recent-posts?limit=${limit}`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error("投稿取得失敗");
            }

            const data = await response.json();

            setPosts(data.posts);
            setHasMorePosts(data.hasMorePosts);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchRandomTags = async (limit = 10) => {
        try {
            const response = await fetch(
                `/api/v1/tags/random?limit=${limit}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("タグ取得失敗");
            }

            const data = await response.json();

            setTags(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async () => {
        setShowSuggestions(false);

        const word = keyword.trim();

        setPostLimit(10);

        if (!word) {

            if (selectedTab === "posts") {
                await fetchRecentPosts(10);
            } else {
                await fetchRandomTags(10);
            }

            return;
        }

        setSearchParams({ keyword: word });

        await search(word, 10);
    };

    const handleSuggestionClick = async (tag) => {
        setKeyword(tag.name);
        setSuggestions([]);
        setShowSuggestions(false);

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

    const handleLoadMorePosts = async () => {
        const nextLimit = postLimit + 10;

        setPostLimit(nextLimit);

        const word = keyword.trim();

        if (!word) {
            await fetchRecentPosts(nextLimit);
        } else {
            await search(word, nextLimit);
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
        <div className="search page">
            <h1 className="page-title">投稿・タグを探す</h1>

            <div className="search-area" ref={searchRef}>
                <div className="search-bar">
                    <input
                        className="field"
                        type="text"
                        placeholder="キーワードを入力"
                        value={keyword}
                        onChange={(e) => {
                            const value = e.target.value;
                            setKeyword(value);
                            setShowSuggestions(true);
                            fetchSuggestions(value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        onFocus={() => {
                            if (keyword.trim()) {
                                fetchSuggestions(keyword);
                                setShowSuggestions(true);
                            }
                        }}
                    />

                    <button
                        className="btn"
                        onClick={handleSearch}
                    >
                        検索
                    </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="search-suggestions">
                        {suggestions.map((tag) => (
                            <div
                                key={tag.id}
                                className="search-suggestion"
                                onClick={() => handleSuggestionClick(tag)}
                            >
                                {tag.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="tabs">
                <button
                    className={`tab ${selectedTab === "posts" ? "active" : ""}`}
                    onClick={() => setSelectedTab("posts")}
                >
                    投稿
                </button>
                <button
                    className={`tab ${selectedTab === "tags" ? "active" : ""}`}
                    onClick={() => {
                        setSelectedTab("tags");
                        if (!keyword.trim()) {
                            fetchRandomTags(10);
                        }
                    }}
                >
                    タグ
                </button>
            </div>

            {selectedTab === "posts" ? (
                <div className="search-results">
                    {posts.map((post) => (
                        <article key={post.id} className="mini-post">

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

                                    <div className="search-date">
                                        {relativeTime(post.createdAt)}
                                    </div>
                                </div>
                            </div>

                            <p className="search-snippet">
                                {post.body}
                            </p>

                            <Link
                                to={`?post=${post.id}`}
                                className="post-detail-link"
                            >
                                詳細...
                            </Link>

                            <div className="tags">
                                {post.tags.map((tag) => {
                                    console.log("rendering tag", tag);

                                    return (
                                        <span key={tag.id}>
                                            #{tag.name}
                                        </span>
                                    );
                                })}
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

                    {hasMorePosts && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <button
                                className="btn"
                                onClick={handleLoadMorePosts}
                            >
                                もっと見る
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="search-results">
                    {tags.map((tag) => {
                        console.log("render tag", tag);

                        const isFollowed = followingTags.includes(tag.name);

                        return (
                            <div
                                key={tag.id}
                                className="row-between tag-result"
                            >
                                <span
                                    className="search-tagname"
                                    onClick={() => navigate(`/tag/${tag.id}`)}
                                >
                                    {tag.name}
                                </span>

                                <button
                                    className={`btn ${isFollowed ? "btn-ghost" : ""}`}
                                    onClick={() => toggleFollow(tag.name)}>
                                    {isFollowed ? "フォロー中 ✓" : "フォローする"}
                                </button>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

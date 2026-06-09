import { useState } from "react";
import { POSTS, TAGS } from "../date/mockData";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

export default function SearchPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedTab, setSelectedTab] = useState("posts");
    const [followedTags, setFollowedTags] = useState(["React", "AWS",]);
    const navigate = useNavigate();

    const filteredPosts = POSTS
        .filter((post) => {
            if (!keyword.trim()) return true;

            const searchWord = keyword.toLowerCase();

            return (
                post.title.toLowerCase().includes(searchWord) ||
                post.content.toLowerCase().includes(searchWord)
            );
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredTags = TAGS.filter((tag) => {
        if (!keyword.trim()) return true;

        return tag.name.toLowerCase().includes(keyword.toLowerCase());
    });

    const toggleFollow = (tagName) => {
        setFollowedTags((prev) =>
            prev.includes(tagName)
                ? prev.filter((name) => name !== tagName)
                : [...prev, tagName]
        );
    };

    return (
        <div className="search page">
            <h1 className="page-title">検索</h1>

            <div className="search-bar">
                <input
                    className="field"
                    type="text"
                    placeholder="本文・タグ・ユーザータグを検索"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {/* 入力に応じてリアルタイムで絞り込むため、ボタンは送信トリガーのみ */}
                <button className="btn" onClick={() => { }}>
                    検索
                </button>
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
                    onClick={() => setSelectedTab("tags")}
                >
                    タグ
                </button>
            </div>

            {selectedTab === "posts" ? (
                <div className="search-results">
                    {filteredPosts.length === 0 && (
                        <p className="empty-note">該当する投稿はありません。</p>
                    )}
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="mini-post">
                            <div className="search-title">{post.title}</div>
                            <div className="search-snippet">{post.content}</div>
                            <div className="search-date">{post.createdAt}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="search-results">
                    {filteredTags.length === 0 && (
                        <p className="empty-note">該当するタグはありません。</p>
                    )}
                    {filteredTags.map((tag) => {
                        const isFollowed = followedTags.includes(tag.name);

                        return (
                            <div key={tag.id} className="row-between">
                                <span
                                    className="search-tagname"
                                    onClick={() => navigate(`tag/${tag.id}`)}
                                >
                                    #{tag.name}
                                </span>

                                <button
                                    className={`btn ${isFollowed ? "btn-quiet" : "btn-ghost"}`}
                                    onClick={() => toggleFollow(tag.name)}
                                >
                                    {isFollowed ? "フォローをやめる" : "フォローする"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

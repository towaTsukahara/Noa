import { useState } from "react";
import { POSTS, TAGS } from "../date/mockData";
import { useNavigate } from "react-router-dom";

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
                post.title
                    .toLowerCase()
                    .includes(searchWord) ||
                post.content
                    .toLowerCase()
                    .includes(searchWord)
            );
        })
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

    const filteredTags = TAGS.filter((tag) => {
        if (!keyword.trim()) return true;

        return tag.name
            .toLowerCase()
            .includes(keyword.toLowerCase());
    });

    const toggleFollow = (tagName) => {
        setFollowedTags((prev) =>
            prev.includes(tagName)
                ? prev.filter(
                    (name) => name !== tagName
                )
                : [...prev, tagName]
        );
    };

    return (
        <div>
            <h1>検索</h1>

            <input
                type="text"
                placeholder="キーワードを入力"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <button onClick={() => handleSearch()}>
                検索
            </button>

            <div>
                <button onClick={() => setSelectedTab("posts")}>投稿</button>
                <button onClick={() => setSelectedTab("tags")}>タグ</button>
            </div>

            <hr />

            {selectedTab === "posts" ? (
                <div>
                    {filteredPosts.map((post) => (
                        <div key={post.id}>
                            <h3>{post.title}</h3>
                            <div>{post.content}</div>
                            <div>post day: {post.createdAt}</div>

                            <hr />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {filteredTags.map((tag) => {
                        const isFollowed = followedTags.includes(tag.name);

                        return (
                            <div key={tag.id}>
                                <span
                                    onClick={() => navigate(`tag/${tag.id}`)}
                                    style={{ cursor: "pointer" }}>
                                    {tag.name}
                                </span>

                                <button onClick={() => toggleFollow(tag.name)}>
                                    {isFollowed ? "フォローをやめる" : "フォローする"}</button>

                                <hr />
                            </div>
                        );
                    })}
                </div>
            )}
        </div >
    );
}
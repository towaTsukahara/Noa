import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedTab, setSelectedTab] = useState("posts");
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await fetch(`/api/v1/search?keyword=${encodeURIComponent(keyword)}`,{
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("検索失敗");
            }

            const data = await response.json();

            setPosts(data.posts);
            setTags(data.tags);

        } catch (error) {
            console.error(error);
        }
    };
    
    const toggleFollow = (tagName) => {
        if (
            myFollowedTags.includes(tagName)
        ) {
            unfollowTag(tagName);
        } else {
            followTag(tagName);
        }
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
            <button onClick={handleSearch}>検索</button>

            <div>
                <button onClick={() => setSelectedTab("posts")}>投稿</button>
                <button onClick={() => setSelectedTab("tags")}>タグ</button>
            </div>

            <hr />

            {selectedTab === "posts" ? (
                <div>
                    {posts.map((post) => (
                        <div key={post.id}>
                            <div>{post.body}</div>

                            <hr />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {tags.map((tag) => {
                        const isFollowed = myFollowedTags.includes(tag.name);

                        return (
                            <div key={tag.id}>
                                <span
                                    onClick={() => navigate(`/tag/${tag.id}`)}
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
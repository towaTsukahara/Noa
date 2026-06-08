//名前変更予定
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function TagDetailPage() {

    const { tagId } = useParams();

    const tag = TAGS.find(
        (tag) => tag.id === Number(tagId)
    );

    const [isFollowed, setIsFollowed] = useState(tag ? getFollowedTags().includes(tag.name) : false);

    const relatedPosts = POSTS.filter((post) =>
        tag && post.tags.includes(tag.name)
    );

    if (!tag) {
        return <div>not found 404</div>
    }

    const toggleFollow = () => {
        if (isFollowed) {
            unfollowTag(tag.name);
        } else {
            followTag(tag.name);
        }

        setIsFollowed(
            getFollowedTags().includes(
                tag.name
            )
        );
    };

    return (
        <div>
            <h1>{tag.name}</h1>
            <button onClick={toggleFollow}>
                {isFollowed ? "unfollow" : "follow"}
            </button>

            <hr />

            <h2>posts</h2>
            {relatedPosts.map((post) => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <div>{post.content}</div>

                    <hr />
                </div>
            ))}
        </div>
    )
}
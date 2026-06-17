import { Link, useNavigate } from "react-router-dom";
import UserHandle from "../user/UserHandle";
import ExpandableText from "../common/ExpandableText";
import { relativeTime } from "../../utils/relativeTime";
import "./MiniPostCard.css";
import "./LikeButton.css"; // .like-button のスタイル
import heart_filled from '/icons/heart_filled.svg';
import heart from '/icons/heart.svg';
import reply from '/icons/reply.svg';
import trashcan from '/icons/trashcan.svg';

// 共通投稿カード
// props:
//   post        … 投稿データ（id, author, body, tags, likeCount, replyCount, likedByMe, createdAt）
//   onLike      … いいねが押されたとき呼ぶ（post を渡す）
//   onDelete    … 削除が押されたとき呼ぶ（post を渡す）。渡されたときだけ削除ボタンを出す（自分の投稿用）
//   isSelected  … 右パネルで開いている投稿か（ハイライト用）
//   showAuthor  … 投稿者（アバター＋名前）を出すか。false なら出さず、日時をアクション行に出す（自分のプロフィール用）
export default function MiniPostCard({
    post,
    onLike,
    onDelete,
    isSelected = false,
    showAuthor = true,
}) {
    const navigate = useNavigate();

    // カードクリックで右パネルを開く
    const openDetail = () => navigate(`?post=${post.id}`);

    return (
        <article
            className={`post-card ${isSelected ? "is-selected" : ""} ${showAuthor ? "" : "no-author"}`}
            onClick={openDetail}
        >
            {showAuthor && (
                <div className="post-header">
                    <div className="avatar"></div>
                    <div>
                        <div className="nickname">
                            <Link
                                to={`/users/${post.author.handle}`}
                                className="author-link"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <UserHandle user={post.author} />
                            </Link>
                        </div>
                        <div className="date">{relativeTime(post.createdAt)}</div>
                    </div>
                </div>
            )}

            <div className="content">
                <ExpandableText text={post.body} clampLines={3} />
            </div>

            <div className="tags">
                {post.tags?.map((tag) => (
                    <span
                        key={tag.id}
                        onClick={(e) => { e.stopPropagation(); navigate(`/tag/${tag.id}`); }}
                    >
                        #{tag.name}
                    </span>
                ))}
            </div>

            <div className="actions">
                <button
                    className={`like-button ${post.likedByMe ? "liked" : ""}`}
                    onClick={(e) => { e.stopPropagation(); onLike(post); }}
                >
                    <img
                        src={post.likedByMe ? heart_filled : heart}
                        alt="いいね"
                        className="icon-like"
                    />
                    <span>{post.likeCount}</span>
                </button>
                <span className="reply">
                    <img src={reply} alt="返信" className="icon-reply" />
                    <span>{post.replyCount}</span>
                </span>

                {/* 投稿者なし（自分のプロフィール）のときは、日時をここに出す */}
                {!showAuthor && (
                    <span className="actions-time">{relativeTime(post.createdAt)}</span>
                )}

                {/* 削除処理が渡されたときだけ、削除ボタンを出す（右端） */}
                {onDelete && (
                    <button
                        className="mini-delete"
                        onClick={(e) => { e.stopPropagation(); onDelete(post); }}
                    >
                        <img src={trashcan} alt="削除" className="icon-delete" />
                    </button>
                )}
            </div>
        </article>
    );
}
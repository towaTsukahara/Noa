import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { relativeTime } from "../utils/relativeTime";
import "./NotificationPage.css";

const NotificationPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api("/me/notifications"); // NotificationResponse[]
                setNotifications(data);
                // 一覧を開いたら既読にする（未読バッジが消える）
                await api("/me/notifications/read", { method: "POST" });
            } catch (e) {
                // 失敗時は空のまま
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // 通知の種類ごとの文言
    const notifText = (type) => {
        switch (type) {
            case "LIKE":
                return "あなたの投稿にいいねがありました";
            case "REPLY":
                return "あなたの投稿に返信がありました";
            case "REPLY_TO_COMMENT":
                return "あなたのコメントに返信がありました";
            default:
                return "新しい通知があります";
        }
    };

    return (
        <div className="notifications page">
            <h2 className="page-title">通知</h2>
            <div className="sub-note">いいね・返信のみ通知します（フォローは非通知）</div>

            {loading && <p className="empty-note">読み込み中...</p>}
            {!loading && notifications.length === 0 && (
                <p className="empty-note">通知はありません</p>
            )}

            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`notif ${n.isRead ? "" : "unread"}`}
                    onClick={() => navigate(`?post=${n.postId}`)}
                    style={{ cursor: "pointer" }}
                >
                    <div className={`notif-icon ${n.type === "LIKE" ? "is-like" : "is-reply"}`}>
                        {n.type === "LIKE" ? "♥" : "@"}
                    </div>
                    <div className="notif-main">
                        <div className="notif-text">{notifText(n.type)}</div>
                        <div className="notif-snippet">{n.postBody}</div>
                        <div className="notif-time">{relativeTime(n.createdAt)}</div>
                    </div>
                    {!n.isRead && <div className="notif-dot"></div>}
                </div>
            ))}
        </div>
    );
};

export default NotificationPage;
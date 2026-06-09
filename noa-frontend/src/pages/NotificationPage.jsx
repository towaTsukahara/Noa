import { useEffect, useState } from "react";
import "./NotificationPage.css";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);

    // 仮データ
    useEffect(() => {
        const dummy = [
            {
                id: 1,
                type: "LIKE",
                actor: { id: 2, name: "Noa-002" },
                post: { id: 10, body: "今日はいい天気ですね" },
                createdAt: "2026-06-08 10:00",
                isRead: false
            },
            {
                id: 2,
                type: "REPLY",
                actor: { id: 3, name: "Noa-003" },
                post: { id: 11, body: "それめっちゃ分かります！" },
                createdAt: "2026-06-08 09:30",
                isRead: true
            }
        ];

        setNotifications(dummy);
    }, []);

    // ~分前、~時間前のように表示
    const formatRelativeTime = (createdAt) => {
        const now = new Date();
        const date = new Date(createdAt);

        const diff = Math.floor((now - date) / 1000); // 秒差

        if (diff < 0) return "今";
        if (diff < 60) return `${diff}秒前`;

        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes}分前`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}時間前`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}日前`;

        // 1週間以上は日付表示
        return date.toLocaleDateString();
    };

    return (
        <div className="notifications page">
            <h2 className="page-title">通知</h2>
            <div className="sub-note">いいね・返信のみ通知します（フォローは非通知）</div>

            {notifications.length === 0 ? (
                <p className="empty-note">通知はありません</p>
            ) : (
                notifications.map((n) => (
                    <div key={n.id} className={`notif ${n.isRead ? "" : "unread"}`}>
                        <div className={`notif-icon ${n.type === "LIKE" ? "is-like" : "is-reply"}`}>
                            {n.type === "LIKE" ? "♥" : "@"}
                        </div>
                        <div className="notif-main">
                            <div className="notif-text">
                                <b className="notif-actor">{n.actor.name}</b> さんが
                                {n.type === "LIKE" ? "いいねしました" : "返信しました"}
                            </div>
                            <div className="notif-snippet">{n.post.body}</div>
                            <div className="notif-time">{formatRelativeTime(n.createdAt)}</div>
                        </div>
                        {!n.isRead && <div className="notif-dot"></div>}
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationPage;

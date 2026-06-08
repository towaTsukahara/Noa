import { useEffect, useState } from "react";

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

        if (diff < 60) {
            return `${diff}秒前`;
        }

        const minutes = Math.floor(diff / 60);
        if (minutes < 60) {
            return `${minutes}分前`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours}時間前`;
        }

        const days = Math.floor(hours / 24);
        if (days < 7) {
            return `${days}日前`;
        }

        // 1週間以上は日付表示
        return date.toLocaleDateString();
    };

    return (
        <div style={{ padding: "20px", textAlign: "left" }}>
            <h2>通知</h2>
            {notifications.length === 0 ? (
                <p>通知はありません</p>
            ) : (
                <div>
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            style={{
                                padding: "12px",
                                borderBottom: "1px solid #ddd",
                                backgroundColor: n.isRead ? "#fff" : "#eef6ff" // 未読強調
                            }}
                        >
                            {/* メインメッセージ */}
                            <div style={{ fontWeight: "bold" }}>
                                {/* 🔵 未読マーク */}
                                {!n.isRead && (
                                    <span style={{ color: "blue", fontSize: "12px" }}>● </span>
                                )}
                                <span style={{ color: n.type === "LIKE" ? "red" : "blue" }}>
                                    {n.type === "LIKE" ? "♡" : "@"}
                                </span>{" "}
                                {n.actor.name}さんが
                                {n.type === "LIKE" ? "いいねしました" : "返信しました"}
                            </div>

                            {/* 投稿内容表示 */}
                            <div style={{ color: "gray", marginTop: "4px" }}>
                                {n.post.body}
                            </div>

                            {/* 時刻 */}
                            <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                                {formatRelativeTime(n.createdAt)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
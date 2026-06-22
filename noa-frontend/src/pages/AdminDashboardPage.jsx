import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/common/ConfirmModal";
import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirm, setConfirm] = useState(null);

    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            navigate("/", { replace: true });
        }
    }, [user]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api("/admin/users");
            setUsers(data);
        } catch (e) {
            setError("ユーザー一覧の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // 停止/解除のトグル：確認モーダルを開く
    const handleToggleStatus = (u) => {
        const willSuspend = u.status === "ACTIVE";
        const action = willSuspend ? "停止" : "解除";
        setConfirm({
            message: `${u.handle} を${action}しますか？`,
            onConfirm: async () => {
                try {
                    await api(`/admin/users/${u.id}/${willSuspend ? "suspend" : "activate"}`, {
                        method: "POST",
                    });
                    await loadUsers();
                } catch (e) {
                    setError(`${action}に失敗しました。`);
                }
            },
        });
    };

    return (
        <div className="admin page">
            <h2 className="page-title">管理ダッシュボード</h2>
            <div className="sub-note">管理者専用。ユーザーの状態確認・対応を行います。</div>
            <div className="admin-nav">
                <button className="btn-ghost" onClick={() => navigate("/admin/reports")}>
                    通報管理へ
                </button>
            </div>

            {loading && <p className="empty-note">読み込み中...</p>}
            {error && <p className="empty-note">{error}</p>}

            {!loading && !error && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ハンドル</th>
                                <th>社員番号</th>
                                <th>メール</th>
                                <th>権限</th>
                                <th>状態</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.handle}</td>
                                    <td>{u.employeeNo}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <span className={`admin-status ${u.status === "ACTIVE" ? "is-active" : "is-suspended"}`}>
                                            {u.status === "ACTIVE" ? "稼働中" : "停止中"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="btn-ghost admin-btn-sm"
                                                onClick={() => navigate(`/admin/users/${u.id}`)}
                                            >
                                                投稿
                                            </button>
                                            {u.role === "ADMIN" ? (
                                                <span className="admin-muted">—</span>
                                            ) : (
                                                <button
                                                    className={u.status === "ACTIVE" ? "btn-danger admin-btn-sm" : "btn-ghost admin-btn-sm"}
                                                    onClick={() => handleToggleStatus(u)}
                                                >
                                                    {u.status === "ACTIVE" ? "停止" : "解除"}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                open={confirm !== null}
                title="確認"
                message={confirm?.message}
                confirmLabel="実行する"
                onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
                onCancel={() => setConfirm(null)}
            />
        </div>
    );
}
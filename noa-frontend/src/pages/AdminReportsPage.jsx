import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { relativeTime } from "../utils/relativeTime";
import "./AdminDashboardPage.css";

export default function AdminReportsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onlyPending, setOnlyPending] = useState(true); // 未対応のみ表示するか

    useEffect(() => {
        if (user && user.role !== "ADMIN") navigate("/", { replace: true });
    }, [user]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const q = onlyPending ? "?status=PENDING" : "";
            const data = await api(`/admin/reports${q}`);
            setReports(data);
        } catch (e) {
            // 空
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, [onlyPending]);

    // 対象を削除（種別に応じて投稿/コメントの管理者削除API）
    const handleDeleteTarget = async (r) => {
        const label = r.targetType === "POST" ? "投稿" : "コメント";
        if (!window.confirm(`この${label}を削除しますか？（管理者削除）`)) return;
        try {
            const path = r.targetType === "POST"
                ? `/admin/posts/${r.targetId}`
                : `/admin/comments/${r.targetId}`;
            await api(path, { method: "DELETE" });
            // 削除したら、その通報も対応済みにする
            await api(`/admin/reports/${r.id}/resolve`, { method: "POST" });
            await loadReports();
        } catch (e) {
            setError("削除に失敗しました。");
        }
    };

    // 対応済みにする（削除せず閉じる）
    const handleResolve = async (reportId) => {
        if (!window.confirm("この通報を対応済みにしますか？")) return;
        try {
            await api(`/admin/reports/${reportId}/resolve`, { method: "POST" });
            await loadReports();
        } catch (e) {
            setError("操作に失敗しました。");
        }
    };

    return (
        <div className="admin page">
            <button className="backbtn" onClick={() => navigate("/admin")}>← 管理トップへ</button>
            <h2 className="page-title">通報管理</h2>
            <div className="sub-note">通報された投稿・コメントを確認し、削除または対応済みにできます。</div>

            <div className="admin-filter">
                <label>
                    <input
                        type="checkbox"
                        checked={onlyPending}
                        onChange={(e) => setOnlyPending(e.target.checked)}
                    />
                    未対応のみ表示
                </label>
            </div>

            {loading && <p className="empty-note">読み込み中...</p>}
            {!loading && reports.length === 0 && (
                <p className="empty-note">{onlyPending ? "未対応の通報はありません。" : "通報はありません。"}</p>
            )}

            {reports.map((r) => (
                <div
                key={r.id}
                className="report-item"
                onClick={() => r.postId && navigate(`?post=${r.postId}`)}
                style={{ cursor: "pointer" }}
            >
                <div className="report-item-head">
                    <span className={`report-type ${r.targetType === "POST" ? "is-post" : "is-comment"}`}>
                        {r.targetType === "POST" ? "投稿" : "コメント"}
                    </span>
                    <span className={`admin-status ${r.status === "PENDING" ? "is-suspended" : "is-active"}`}>
                        {r.status === "PENDING" ? "未対応" : "対応済み"}
                    </span>
                    <span className="report-time">{relativeTime(r.createdAt)}</span>
                </div>

                <div className="report-target-body">{r.targetBody}</div>

                <div className="report-meta">
                    <span>通報者: {r.reporterHandle}</span>
                    {r.reason && <span>理由: {r.reason}</span>}
                </div>

                {r.status === "PENDING" && (
                    <div className="report-item-actions">
                        <button className="btn-danger admin-btn-sm" onClick={(e) => { e.stopPropagation(); handleDeleteTarget(r); }}>
                            対象を削除
                        </button>
                        <button className="btn-quiet admin-btn-sm" onClick={(e) => { e.stopPropagation(); handleResolve(r.id); }}>
                            対応済みにする
                        </button>
                    </div>
                )}
            </div>
            ))}
        </div>
    );
}
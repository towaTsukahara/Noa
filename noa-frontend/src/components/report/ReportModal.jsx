import { useState } from "react";
import { api } from "../../api/client";
import "./ReportModal.css";

// 通報モーダル。targetType("POST"/"COMMENT")とtargetIdを受け取り、理由を入れて送信。
export default function ReportModal({ targetType, targetId, onClose }) {
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await api("/reports", {
                method: "POST",
                body: JSON.stringify({ targetType, targetId, reason: reason.trim() || null }),
            });
            setDone(true); // 送信完了表示
        } catch (e) {
            if (e?.status === 409) {
                alert("すでに通報済みです。");
            } else {
                alert("通報に失敗しました。");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="report-overlay" onClick={onClose}>
            <div className="report-card" onClick={(e) => e.stopPropagation()}>
                {done ? (
                    <>
                        <h3 className="report-title">通報を受け付けました</h3>
                        <p className="report-note">ご報告ありがとうございます。運営が確認します。</p>
                        <div className="report-actions">
                            <button className="btn" onClick={onClose}>閉じる</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="report-title">この内容を通報する</h3>
                        <p className="report-note">理由を任意で入力できます（空でも通報できます）。</p>
                        <textarea
                            className="field report-textarea"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="例: 誹謗中傷、スパムなど"
                            maxLength={500}
                        />
                        <div className="report-actions">
                            <button className="btn-quiet" onClick={onClose}>やめる</button>
                            <button className="btn-danger" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "送信中..." : "通報する"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
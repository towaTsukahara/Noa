import "./ConfirmModal.css";

// 汎用確認モーダル。open のとき表示。OKで onConfirm、キャンセルで onCancel。
export default function ConfirmModal({
    open,
    title = "確認",
    message,
    confirmLabel = "削除する",
    cancelLabel = "キャンセル",
    danger = true,        // 危険な操作（削除など）は確認ボタンを赤く
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="btn btn-quiet" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        className={danger ? "btn-danger" : "btn"}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
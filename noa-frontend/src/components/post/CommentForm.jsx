import { useState, forwardRef, useRef, useEffect } from "react";
import CharCount from "../common/CharCount";

// コメント・返信の入力フォーム。
// onAddComment(text) … 送信時に呼ぶ
// onCancel … キャンセルボタン（任意。あれば表示）
// placeholder … 入力欄のプレースホルダ（既定「返信を書く」）
// submitLabel … 送信ボタンの文言（既定「返信する」）
const CommentForm = forwardRef(function CommentForm(
    { onAddComment, onCancel, placeholder = "返信を書く", submitLabel = "返信する" },
    ref
) {
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const innerRef = useRef(null);

    // マウント時（フォームが開いたとき）に自動でフォーカス
    useEffect(() => {
        innerRef.current?.focus();
    }, []);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setSubmitting(true);
        try {
            await onAddComment(text);
            setText("");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comment-form">
            <textarea
                ref={(el) => {
                    innerRef.current = el;
                    if (typeof ref === "function") ref(el);
                    else if (ref) ref.current = el;
                }}
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
            />
            <div className="comment-form-footer">
                <CharCount current={text.length} max={500} />
                <div className="comment-form-actions">
                    {onCancel && (
                        <button className="btn btn-quiet" onClick={onCancel} disabled={submitting}>
                            キャンセル
                        </button>
                    )}
                    <button
                        className="btn"
                        onClick={handleSubmit}
                        disabled={submitting || text.trim() === ""}
                    >
                        {submitting ? "送信中..." : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default CommentForm;
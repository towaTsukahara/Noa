import { useSearchParams } from "react-router-dom";
import "./PostDetailPanel.css";

// 右カラムの投稿詳細パネル。?post=123 の id を読んで表示する。
// （中身の移植は次のステップ。今は枠だけ）
export default function PostDetailPanel() {
    const [searchParams, setSearchParams] = useSearchParams();
    const postId = searchParams.get("post");

    // ?post が無ければ何も出さない（パネル自体を表示しない）
    if (!postId) return null;

    // パネルを閉じる＝?post を URL から消す
    const close = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("post");
        setSearchParams(next, { replace: false });
    };

    return (
        <aside className="detail-panel">
            <div className="detail-panel-head">
                <button className="backbtn" onClick={close}>✕ 閉じる</button>
            </div>
            <div className="detail-panel-body">
                <p className="empty-note">投稿 {postId} の詳細がここに表示されます（次のステップで移植）。</p>
            </div>
        </aside>
    );
}
import "./ErrorBanner.css";

// 画面内エラー表示。message があれば赤いバナーを出す。× で消せる。
export default function ErrorBanner({ message, onClose }) {
    if (!message) return null;
    return (
        <div className="error-banner">
            <span className="error-banner-text">{message}</span>
            {onClose && (
                <button className="error-banner-close" onClick={onClose} aria-label="閉じる">×</button>
            )}
        </div>
    );
}
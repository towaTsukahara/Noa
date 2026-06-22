import { useState, useRef, useEffect } from "react";
import "./ExpandableText.css";

// clampLines: 折りたたむ行数（デフォルト5）
export default function ExpandableText({ text, clampLines = 5 }) {
    const [expanded, setExpanded] = useState(false);   // 全文展開しているか
    const [isClamped, setIsClamped] = useState(false); // 省略が必要なほど長いか
    const textRef = useRef(null);

    // 実際に省略が起きているか（要素の高さで判定）
    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setIsClamped(el.scrollHeight > el.clientHeight + 1);
    }, [text]);

    return (
        <div className="expandable">
            <p
                ref={textRef}
                className={`expandable-text ${expanded ? "is-expanded" : ""}`}
                style={!expanded ? { WebkitLineClamp: clampLines } : undefined}
            >
                {text}
            </p>
            {/* 省略されている時だけボタンを出す。展開後は常に「閉じる」を出す */}
            {(isClamped || expanded) && (
                <button
                    className="expandable-toggle"
                    onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                >
                    {expanded ? "閉じる" : "続きを読む"}
                </button>
            )}
        </div>
    );
}
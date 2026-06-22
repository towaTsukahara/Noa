import { useState, useRef, useEffect } from "react";
import "./MoreMenu.css";

// 「…」メニュー。子に渡したメニュー項目を、クリックで開閉表示する。
// items: [{ label, onClick, danger? }]
export default function MoreMenu({ items }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // メニューの外をクリックしたら閉じる
    useEffect(() => {
        const onDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div className="more-menu" ref={ref}>
            <button className="more-menu-trigger" onClick={() => setOpen((v) => !v)} aria-label="メニュー">
                ⋯
            </button>
            {open && (
                <div className="more-menu-list">
                    {items.map((item, i) => (
                        <button
                            key={i}
                            className={`more-menu-item ${item.danger ? "is-danger" : ""}`}
                            onClick={() => {
                                setOpen(false);
                                item.onClick();
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
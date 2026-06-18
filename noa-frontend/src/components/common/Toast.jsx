import { useEffect } from "react";
import "./Toast.css";

// 画面上部に一定時間出るトースト通知。
// message があれば表示し、duration 後に onClose を呼ぶ。
export default function Toast({ message, onClose, duration = 2500 }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div className="toast">
            {message}
        </div>
    );
}
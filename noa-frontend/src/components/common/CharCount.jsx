import "./CharCount.css";

// 文字数カウント表示。current（現在の文字数）と max（最大）を受け取る。
// 上限に近づく/超えると色を変える。
export default function CharCount({ current, max }) {
    const over = current > max;
    const near = !over && current >= max * 0.9; // 90%以上で警告色

    return (
        <span className={`char-count ${over ? "is-over" : near ? "is-near" : ""}`}>
            {current} / {max}
        </span>
    );
}
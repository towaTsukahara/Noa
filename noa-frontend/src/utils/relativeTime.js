// ISO日時文字列（例 2026-06-01T10:00:00Z）を「◯分前」のような相対表示に変換する
export function relativeTime(isoString) {
  const date = new Date(isoString);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return "たった今";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}分前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}時間前`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}日前`;

  // 1週間以上前は日付で表示
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });
}
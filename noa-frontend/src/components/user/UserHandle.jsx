/**
 * ユーザーの表示名を秘匿ルールに従って表示する共通部品（F-105）。
 *
 * 表示ルール:
 *   - nickname があればそれを表示（閲覧者が付けた呼び名。本人や他人には見えない）
 *   - なければ handle を表示（例: Noa-002）
 *   - 氏名・役職・社員番号などは「一切表示しない」。このため、
 *     ここに渡すデータは handle / nickname だけを前提にする。
 *
 * 使い方:
 *   <UserHandle user={post.author} />
 *   user は { handle, nickname } を持つオブジェクト（UserSummary や投稿の author）。
 */
function UserHandle({ user }) {
  if (!user) return null;

  // nickname 優先、なければ handle（完全秘匿）
  const label = user.nickname || user.handle;

  return <span className="user-handle">{label}</span>;
}

export default UserHandle;
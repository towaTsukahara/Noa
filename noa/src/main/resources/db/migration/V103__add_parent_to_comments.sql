-- comments に親コメントへの参照を追加（自己参照）
-- ON DELETE CASCADE：親コメントが削除されたら、その返信も自動で削除（連鎖）
ALTER TABLE comments
  ADD COLUMN parent_comment_id BIGINT
  REFERENCES comments(id) ON DELETE CASCADE;

-- 親ごとの返信取得を速くするインデックス
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
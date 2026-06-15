import { useState } from "react";
import { api } from "../../api/client";
import "./PostComposeModal.css";

function PostComposePage({ onClose, onPosted }) {
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const created = await api("/posts", {
        method: "POST",
        body: JSON.stringify({ body, tags: selectedTags }),
      });
      if (onPosted) onPosted(created);
      if (onClose) onClose();
    } catch (e) {
      setError("投稿できませんでした。本文を確認してください（1〜1000文字）。");
    } finally {
      setSubmitting(false);
    }
  };

  const searchTags = async (keyword) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await api(
        `/tags?q=${encodeURIComponent(keyword)}`
      );

      setSuggestions(result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>呼称ほしい</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <textarea
          className="modal-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="いまどうしてる？"
          maxLength={1000}
        />

        <div className="selected-tags">
          {selectedTags.map((tag) => (
            <span key={tag} className="tag-chip">
              #{tag}

              <button
                type="button"
                onClick={() =>
                  setSelectedTags(
                    selectedTags.filter(
                      (t) => t !== tag
                    )
                  )
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="tag-area">
          <input
            type="text"
            className="modal-tags"
            value={tagsInput}
            onChange={(e) => {
              const value = e.target.value;
              setTagsInput(value)
              searchTags(value);
            }}
            placeholder="タグ（カンマ区切り。例: React, 質問）"
          />

          {suggestions.length > 0 && (
            <ul className="tag-suggestions">
              {suggestions.map((tag) => (
                <li
                  key={tag.id}
                  onClick={() => {
                    if (
                      !selectedTags.includes(tag.name)
                    ) {
                      setSelectedTags([
                        ...selectedTags,
                        tag.name,
                      ]);
                    }

                    setTagsInput("");
                    setSuggestions([]);
                  }}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-counter">{body.length}/1000</div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          {/* TODO(フェーズ2): 画像・動画・コード・ファイルの添付はフェーズ2 */}
          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={submitting || body.trim() === ""}
          >
            {submitting ? "投稿中..." : "投稿"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostComposePage;

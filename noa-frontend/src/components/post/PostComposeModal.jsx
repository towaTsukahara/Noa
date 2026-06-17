import { useState } from "react";
import { api } from "../../api/client";
import CharCount from "../common/CharCount";
import "./PostComposeModal.css";

function PostComposePage({ onClose, onPosted }) {
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

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

      setSuggestions(result.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      setActiveIndex((prev) =>
        Math.min(
          prev + 1,
          optionCount - 1
        )
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setActiveIndex((prev) => {
        if (prev <= 0) {
          return -1;
        }
        return prev - 1;
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      // ↓選択中
      if (
        activeIndex >= 0 &&
        activeIndex < suggestions.length
      ) {
        addTag(
          suggestions[activeIndex].name
        );
        return;
      }

      // 候補1件目
      if (suggestions.length > 0) {
        addTag(suggestions[0].name);
        return;
      }

      // 新規作成
      if (showCreateTag &&
        activeIndex === suggestions.length
      ) {
        addTag(tagsInput.trim());
        return;
      }
    }
  };

  const showCreateTag =
    tagsInput.trim().length > 0 &&
    !suggestions.some(
      (s) =>
        s.name.toLowerCase() ===
        tagsInput.trim().toLowerCase()
    );

  const optionCount =
    suggestions.length +
    (showCreateTag ? 1 : 0);

  const addTag = (tagName) => {
    if (!tagName) return;

    if (!selectedTags.includes(tagName)) {
      setSelectedTags((prev) => [
        ...prev,
        tagName,
      ]);
    }

    setTagsInput("");
    setSuggestions([]);
    setActiveIndex(-1);
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
            onKeyDown={handleTagKeyDown}
            placeholder="タグ（カンマ区切り。例: React, 質問）"
            maxLength={30}
          />

          {(suggestions.length > 0 || showCreateTag) && (
            <ul className="tag-suggestions">
              {suggestions.map((tag, index) => (
                <li
                  className={
                    index === activeIndex ? "active" : ""
                  }
                  key={tag.id}
                  onClick={() => addTag(tag.name)}
                >
                  {tag.name}
                </li>
              ))}
              {showCreateTag && (
                <li
                  className={
                    activeIndex === suggestions.length
                      ? "create-tag active"
                      : "create-tag"
                  }
                  onClick={() =>
                    addTag(tagsInput.trim())
                  }
                >
                  ＋ "{tagsInput}" を新規作成
                </li>
              )}
            </ul>
          )}

          <div className="tag-count">
            <CharCount current={tagsInput.length} max={30} />
          </div>
        </div>

        <div className="modal-counter">
          <CharCount current={body.length} max={1000} />
        </div>

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

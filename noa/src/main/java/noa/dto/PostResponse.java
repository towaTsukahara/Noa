package noa.dto;

import noa.entity.Post;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

/**
 * 投稿のレスポンス（PostSummary）。
 * author は秘匿のため handle / nickname のみ（F-105 と同じ方針）。
 */
public record PostResponse(
        Long id,
        Map<String, Object> author, // { handle, nickname }
        Long parentId,
        String body,
        List<String> tags,
        int likeCount,
        boolean likedByMe,
        int replyCount,
        boolean isDeleted,
        OffsetDateTime createdAt)

{
    public static PostResponse from(Post post, long likeCount, boolean likedByMe) {
        Map<String, Object> author = Map.of(
                "handle", post.getAuthor().getHandle());
        // TODO(F-115): タグは未実装のため空。
        // TODO(F-109): replyCount は返信実装後に集計。今は 0。
        return new PostResponse(
                post.getId(),
                author,
                post.getParentId(),
                post.getBody(),
                List.of(),
                (int) likeCount,
                likedByMe,
                0,
                post.isDeleted(),
                post.getCreatedAt());
    }
}
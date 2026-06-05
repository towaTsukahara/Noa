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
public static PostResponse from(Post post, long likeCount, boolean likedByMe, long replyCount) {
        Map<String, Object> author = Map.of(
            "handle", post.getAuthor().getHandle()
        );
        // TODO(F-115): タグは未実装のため空。
        return new PostResponse(
            post.getId(),
            author,
            post.getParentId(),
            post.getBody(),
            List.of(),        // tags
            (int) likeCount,
            likedByMe,
            (int) replyCount,
            post.isDeleted(),
            post.getCreatedAt()
        );
    }}
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
        public static PostResponse from(Post post, long likeCount, boolean likedByMe, long replyCount, String authorNickname) {
        // author は handle と nickname（nickname は viewer が付けていれば値、なければ null）
        Map<String, Object> author = new java.util.HashMap<>();
        author.put("handle", post.getAuthor().getHandle());
        author.put("nickname", authorNickname);

        List<String> tagNames = (post.getTags() == null)
                ? List.of()
                : post.getTags().stream().map(noa.entity.Tag::getName).toList();
        return new PostResponse(
                post.getId(),
                author,
                post.getParentId(),
                post.getBody(),
                tagNames,
                (int) likeCount,
                likedByMe,
                (int) replyCount,
                post.isDeleted(),
                post.getCreatedAt());
    }
}
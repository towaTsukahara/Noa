package noa.mock;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** 開発用モックの固定サンプルデータ生成。実装が出来たら mock パッケージごと削除する。 */
public class MockData {

    public static Map<String, Object> user(String handle, String nickname) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("handle", handle);
        m.put("nickname", nickname); // null 可
        return m;
    }

    public static Map<String, Object> userSummary(String handle, String nickname, String bio) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("handle", handle);
        m.put("nickname", nickname);
        m.put("bio", bio);
        Map<String, Object> tags = new LinkedHashMap<>();
        tags.put("tech", List.of("react", "typescript"));
        tags.put("hobby", List.of("コーヒー"));
        tags.put("cert", List.of());
        m.put("tags", tags);
        m.put("isFollowing", false);
        return m;
    }

    public static Map<String, Object> post(long id, String authorHandle, Long parentId,
                                            String body, int likeCount, boolean likedByMe, int replyCount) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("author", user(authorHandle, null));
        m.put("parentId", parentId); // null 可
        m.put("body", body);
        m.put("tags", List.of("spring boot", "質問"));
        m.put("likeCount", likeCount);
        m.put("likedByMe", likedByMe);
        m.put("replyCount", replyCount);
        m.put("isDeleted", false);
        m.put("createdAt", "2026-06-01T10:00:00Z");
        return m;
    }

    public static Map<String, Object> page(List<?> items, Object nextCursor) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("items", items);
        m.put("nextCursor", nextCursor); // null 可
        return m;
    }

    public static Map<String, Object> me() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("handle", "Noa-001");
        m.put("employeeNo", "A1001");
        m.put("email", "user001@skywill.jp");
        m.put("role", "ADMIN");
        m.put("status", "ACTIVE");
        m.put("emailVerified", true);
        m.put("bio", "バックエンド中心。Spring Boot とアーキテクチャの話が好きです。");
        Map<String, Object> tags = new LinkedHashMap<>();
        tags.put("tech", List.of("java", "spring boot"));
        tags.put("hobby", List.of("コーヒー"));
        tags.put("cert", List.of("基本情報技術者"));
        m.put("tags", tags);
        return m;
    }

    public static Map<String, Object> notification(long id, String type, String actorHandle,
                                                    long postId, String excerpt, boolean isRead) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("type", type);
        m.put("actor", user(actorHandle, null));
        Map<String, Object> post = new LinkedHashMap<>();
        post.put("id", postId);
        post.put("excerpt", excerpt);
        m.put("post", post);
        m.put("isRead", isRead);
        m.put("createdAt", "2026-06-01T11:00:00Z");
        return m;
    }

    public static Map<String, Object> tag(long id, String name) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("name", name);
        return m;
    }

    public static Map<String, Object> ok() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("result", "ok");
        return m;
    }
}

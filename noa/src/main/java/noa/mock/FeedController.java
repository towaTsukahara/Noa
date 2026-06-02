package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "タイムライン・検索")
public class FeedController {

    @Operation(summary = "タイムライン（モック）")
    @GetMapping("/timeline")
    public Map<String, Object> timeline(@RequestParam(required = false) Integer limit,
                                        @RequestParam(required = false) Long cursor,
                                        @RequestParam(required = false, defaultValue = "desc") String sort) {
        return MockData.page(List.of(
                MockData.post(1, "Noa-001", null, "これはモックの投稿です", 0, false, 2),
                MockData.post(2, "Noa-002", null, "APIがつながっています", 3, false, 0)
        ), null);
    }

    @Operation(summary = "投稿本文の部分一致検索（モック）")
    @GetMapping("/search/posts")
    public Map<String, Object> searchPosts(@RequestParam(required = false) String q) {
        return MockData.page(List.of(
                MockData.post(3, "Noa-003", null, "検索にヒットした投稿（モック）", 1, false, 0)
        ), null);
    }

    @Operation(summary = "ユーザーをタグで検索（モック）")
    @GetMapping("/search/users")
    public Map<String, Object> searchUsers(@RequestParam(required = false) String q) {
        return MockData.page(List.of(
                MockData.userSummary("Noa-002", null, "React中心"),
                MockData.userSummary("Noa-006", null, "機械学習に興味")
        ), null);
    }
}

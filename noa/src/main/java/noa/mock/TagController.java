package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "タグ")
public class TagController {

    @Operation(summary = "タグ検索・サジェスト（モック）")
    @GetMapping("/tags")
    public List<Map<String, Object>> search(@RequestParam(required = false) String q) {
        return List.of(
                MockData.tag(2, "spring boot"),
                MockData.tag(9, "spring security")
        );
    }

    @Operation(summary = "特定タグの投稿一覧（モック）")
    @GetMapping("/tags/{tagId}/posts")
    public Map<String, Object> tagPosts(@PathVariable long tagId) {
        return MockData.page(List.of(
                MockData.post(1, "Noa-001", null, "Spring Bootの@Transactionalの話", 3, false, 2),
                MockData.post(11, "Noa-001", null, "Spring Securityがすんなり動いた", 1, false, 0)
        ), null);
    }

    @Operation(summary = "タグをフォロー（モック）")
    @PostMapping("/tags/{tagId}/follow")
    public Map<String, Object> followTag(@PathVariable long tagId) {
        return MockData.ok();
    }

    @Operation(summary = "タグフォロー解除（モック）")
    @DeleteMapping("/tags/{tagId}/follow")
    public Map<String, Object> unfollowTag(@PathVariable long tagId) {
        return MockData.ok();
    }

    @Operation(summary = "自分がフォロー中のタグ一覧（モック）")
    @GetMapping("/me/followed-tags")
    public List<Map<String, Object>> followedTags() {
        return List.of(
                MockData.tag(2, "spring boot"),
                MockData.tag(1, "java")
        );
    }
}

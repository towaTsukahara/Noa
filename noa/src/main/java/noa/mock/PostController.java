package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "投稿・返信")
public class PostController {

    @Operation(summary = "投稿作成（モック）")
    @PostMapping("/posts")
    public Map<String, Object> create(@RequestBody(required = false) Map<String, Object> body) {
        return MockData.post(100, "Noa-001", null, "新しく作成された投稿（モック）", 0, false, 0);
    }

    @Operation(summary = "投稿詳細（モック）")
    @GetMapping("/posts/{id}")
    public Map<String, Object> get(@PathVariable long id) {
        return MockData.post(id, "Noa-003", null,
                "Springの@Transactionalについて教えてください", 3, false, 2);
    }

    @Operation(summary = "投稿/返信の削除（モック）")
    @DeleteMapping("/posts/{id}")
    public Map<String, Object> delete(@PathVariable long id) {
        return MockData.ok();
    }

    @Operation(summary = "返信一覧（モック）")
    @GetMapping("/posts/{id}/replies")
    public Map<String, Object> replies(@PathVariable long id) {
        return MockData.page(List.of(
                MockData.post(201, "Noa-002", id, "サービス層に付けています。", 1, false, 0),
                MockData.post(202, "Noa-005", id, "自分もサービス層派です。", 0, false, 0)
        ), null);
    }

    @Operation(summary = "返信作成（モック）")
    @PostMapping("/posts/{id}/replies")
    public Map<String, Object> reply(@PathVariable long id,
                                     @RequestBody(required = false) Map<String, Object> body) {
        return MockData.post(203, "Noa-001", id, "新しい返信（モック）", 0, false, 0);
    }
}

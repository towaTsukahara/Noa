package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "いいね")
public class LikeController {

    @Operation(summary = "いいねする（モック）")
    @PostMapping("/posts/{id}/like")
    public Map<String, Object> like(@PathVariable long id) {
        return MockData.ok();
    }

    @Operation(summary = "いいね取り消し（モック）")
    @DeleteMapping("/posts/{id}/like")
    public Map<String, Object> unlike(@PathVariable long id) {
        return MockData.ok();
    }

    @Operation(summary = "自分がいいねした投稿一覧（モック）")
    @GetMapping("/me/likes")
    public Map<String, Object> myLikes() {
        return MockData.page(List.of(
                MockData.post(2, "Noa-002", null, "ReactのuseEffectの依存配列の話", 5, true, 1),
                MockData.post(6, "Noa-006", null, "LightFMを触っている", 3, true, 2)
        ), null);
    }
}

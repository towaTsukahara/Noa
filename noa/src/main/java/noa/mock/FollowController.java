package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "フォロー")
public class FollowController {

    @Operation(summary = "フォローする（モック）")
    @PostMapping("/users/{handle}/follow")
    public Map<String, Object> follow(@PathVariable String handle) {
        return MockData.ok();
    }

    @Operation(summary = "フォロー解除（モック）")
    @DeleteMapping("/users/{handle}/follow")
    public Map<String, Object> unfollow(@PathVariable String handle) {
        return MockData.ok();
    }

    @Operation(summary = "ニックネーム付与・変更（モック）")
    @PutMapping("/users/{handle}/nickname")
    public Map<String, Object> setNickname(@PathVariable String handle,
                                           @RequestBody(required = false) Map<String, Object> body) {
        return MockData.ok();
    }

    @Operation(summary = "ニックネーム削除（モック）")
    @DeleteMapping("/users/{handle}/nickname")
    public Map<String, Object> deleteNickname(@PathVariable String handle) {
        return MockData.ok();
    }

    @Operation(summary = "自分がフォロー中のユーザー一覧（モック）")
    @GetMapping("/me/following")
    public Map<String, Object> following() {
        return MockData.page(List.of(
                MockData.userSummary("Noa-002", "Reactの人", "フロント中心"),
                MockData.userSummary("Noa-003", null, "DBに強い")
        ), null);
    }
}

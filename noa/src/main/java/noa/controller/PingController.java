package noa.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PingController {

    // 疎通確認用
    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("status", "ok", "service", "noa");
    }

    @GetMapping("/timeline")
    public Map<String, Object> timeline() {
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("items", List.of(
                Map.of("id", 1, "body", "これはモックの投稿です", "likeCount", 0),
                Map.of("id", 2, "body", "APIがつながっています", "likeCount", 3)));
        result.put("nextCursor", null); // HashMap なら null を入れられる
        return result;
    }
}
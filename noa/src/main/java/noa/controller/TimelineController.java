package noa.controller;

import noa.service.PostService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TimelineController {

    private final PostService postService;

    public TimelineController(PostService postService) {
        this.postService = postService;
    }

    // タイムライン（通常投稿を新しい順・カーソルページング）
    @GetMapping("/timeline")
    public Map<String, Object> timeline(
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "20") int limit) {
        return postService.getTimeline(cursor, limit);
    }
}
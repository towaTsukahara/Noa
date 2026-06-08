package noa.controller;

import java.util.*;
import org.springframework.web.bind.annotation.*;
import noa.dto.TagResponse;
import noa.service.TagService;
import noa.dto.SaveTagRequest;

@RestController
@RequestMapping("/api/v1")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("/tags")
    public List<TagResponse> search(@RequestParam(required = false) String q) {
        return tagService.search(q);
    }

    @PostMapping("/tags/save")
    public Map<String, String> save(@RequestBody SaveTagRequest req) {
        tagService.saveTags(req); 

        return Map.of("status", "ok");
    }

}

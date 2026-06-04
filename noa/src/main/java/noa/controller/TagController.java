package noa.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import noa.dto.TagResponse;
import noa.dto.SaveTagRequest;
import noa.service.TagService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    // タグ一覧取得
    @GetMapping
    public List<TagResponse> getTags() {
        return tagService.getAllTags();
    }

    // タグ保存
    @PostMapping("/save")
    public void saveTags(@RequestBody SaveTagRequest request) {
        tagService.saveTags(request);
    }

}
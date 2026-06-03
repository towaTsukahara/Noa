package noa.controller;

import org.springframework.web.bind.annotation.RestController;

import noa.repository.TagRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

import noa.dto.TagResponse;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/tags")
public class TagController {
    private final TagRepository tagRepository;

    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /*
     * @GetMapping
     * public List<String> getTags() {
     * return tagRepository.findAll()
     * .stream()
     * .map(tag -> tag.getName())
     * .toList();
     * }
     */
    /*
     * @GetMapping
     * public List<Tag> getTags() {
     * return tagRepository.findAll();
     * }
     */
    /*
     * @GetMapping
     * public List<TagResponse> getTags() {
     * return tagRepository.findAll()
     * .stream()
     * .map(tag -> {
     * String type;
     * 
     * // 👇 仮ルール（ここ自由に変えられる）
     * if (tag.getId() <= 11) {
     * type = "skill";
     * } else {
     * type = "hobby";
     * }
     * 
     * return new TagResponse(tag.getId(), tag.getName(), type);
     * })
     * .toList();
     * }
     */
    @GetMapping
    public List<TagResponse> getTags() {
        return tagRepository.findAll()
                .stream()
                .map(tag -> {
                    String type;

                    if (tag.getId() <= 11) {
                        type = "skill";
                    } else {
                        type = "hobby";
                    }

                    return new TagResponse(tag.getId(), tag.getName(), type);
                })
                .toList();
    }
}

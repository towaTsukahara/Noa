package noa.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:5173")
public class TagController {
    @GetMapping
    public Map<String, List<String>> getTags() {
        Map<String, List<String>> tags = new HashMap<>();
        tags.put("hobby", List.of("料理", "旅行", "映画"));
        tags.put("skill", List.of("React", "Java", "Python"));

        return tags;
    }

}

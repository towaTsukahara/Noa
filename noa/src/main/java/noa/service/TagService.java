package noa.service;

import noa.dto.TagResponse;
import noa.entity.Tag;
import noa.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Tag findOrCreate(String rawName) {
        String name = rawName.trim().toLowerCase();
        return tagRepository.findByName(name).orElseGet(() -> {
            Tag t = new Tag();
            t.setName(name);
            return tagRepository.save(t);
        });
    }

    public List<TagResponse> search(String q) {
        if (q == null || q.isBlank())
            return List.of();
        return tagRepository.findByNameContainingIgnoreCaseOrderByName(q.trim())
                .stream().limit(20).map(TagResponse::from).toList();
    }
}

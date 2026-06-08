package noa.service;

import java.util.*;

import noa.dto.ProfileUpdateRequest;
import noa.entity.ProfileUserTag;
import noa.entity.Tag;
import noa.entity.User;
import noa.repository.PostRepository;
import noa.repository.ProfileUserTagRepository;
import noa.repository.UserRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileUserTagRepository userTagRepository;
    private final TagService tagService;
    private final PostRepository postRepository;

    public ProfileService(
            UserRepository userRepository,
            ProfileUserTagRepository userTagRepository,
            TagService tagService,
            PostRepository postRepository,
            PostService postService) {

        this.userRepository = userRepository;
        this.userTagRepository = userTagRepository;
        this.tagService = tagService;
        this.postRepository = postRepository;
    }

    public long getPostCounts(User user) {
        return postRepository.countByAuthorIdAndParentIdIsNullAndIsDeletedFalse(user.getId());
    }

    public Map<String, List<String>> tagsOf(User user) {

        List<ProfileUserTag> rows = userTagRepository.findByUser(user);
        Map<String, List<String>> tags = new LinkedHashMap<>();
        tags.put("tech", namesOf(rows, "TECH"));
        tags.put("hobby", namesOf(rows, "HOBBY"));
        tags.put("cert", namesOf(rows, "CERT"));
        return tags;
    }

    private List<String> namesOf(List<ProfileUserTag> rows, String category) {
        return rows.stream()
                .filter(r -> r.getCategory().equals(category))
                .map(r -> r.getTag().getName())
                .toList();
    }

    @Transactional
    public void updateProfile(User me, ProfileUpdateRequest req) {

        me.setBio(req.bio());
        userRepository.save(me);

        userTagRepository.deleteByUser(me);
        saveTags(me, req.techTags(), "TECH");
        saveTags(me, req.hobbyTags(), "HOBBY");
        saveTags(me, req.certTags(), "CERT");
    }

    private void saveTags(User me, List<String> names, String category) {
        
        if (names == null) return;
        Set<String> seen = new HashSet<>();
        for (String raw : names) {
            String norm = raw.trim().toLowerCase();
            if (norm.isEmpty() || !seen.add(norm)) continue;
            Tag tag = tagService.findOrCreate(raw);
            ProfileUserTag link = new ProfileUserTag();
            link.setUser(me);
            link.setTag(tag);
            link.setCategory(category);
            userTagRepository.save(link);
        }
    }
}

package noa.service;

//import java.util.HashSet;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import noa.dto.ProfileUpdateRequest;
//import noa.entity.ProfileUserTag;
import noa.repository.UserRepository;
import noa.entity.User;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    /*
     * private final TagRepository tagRepository;
     * private final ProfileUserTagRepository userTagRepository;
     */

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Transactional
    public void updateProfile(User me, ProfileUpdateRequest req) {

        me.setBio(req.bio());
        userRepository.save(me);

        /*
         * userTagRepository.deleteByUser(me);
         * 
         * saveTags(me, req.techTags(), "TECH");
         * saveTags(me, req.hobbyTags(), "HOBBY");
         * saveTags(me, req.certTags(), "CERT");
         */
    }

    /*
    private void saveTags(User me, List<String> name, String category) {
        if (name == null)
            return;
        Set<String> seen = new HashSet<>();
        for (String raw : names) {
            String name = raw.trim().toLowerCase();
            if (name.isEmpty() || !seen.add(name))
                continue;

            Tag tag = tagRepository.findByName(name).orElseGet(() -> {
                Tag t = new Tag();
                t.setName(name);
                return tagRepository.save(t);
            });

            ProfileUserTag link = new ProfileUserTag();
            link.setUser(me);
            link.setTag(tag);
            link.setCategory(category);
            userTagRepository.save(link);
        }
    }
    */
}

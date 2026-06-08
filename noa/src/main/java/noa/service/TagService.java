package noa.service;

import noa.entity.ProfileUserTag;
import noa.entity.Tag;
import noa.dto.SaveTagRequest;
import noa.dto.TagResponse;
import noa.repository.ProfileUserTagRepository;
import noa.repository.TagRepository;
import noa.entity.User;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final ProfileUserTagRepository profileUserTagRepository;

    public TagService(TagRepository tagRepository,
            ProfileUserTagRepository profileUserTagRepository) {
        this.tagRepository = tagRepository;
        this.profileUserTagRepository = profileUserTagRepository;
    }
    public List<TagResponse> search(String q) {
        if (q == null || q.isBlank())
            return tagRepository.findAll()
                    .stream()
                    .map(TagResponse::from)
                    .toList();
        return tagRepository.findByNameContainingIgnoreCaseOrderByName(q.trim())
                .stream().limit(20).map(TagResponse::from).toList();
    }

    // 新規作成のしくみ：正規化して「あれば使う・無ければ作る」（プロフィール保存から呼ばれる）
    public Tag findOrCreate(String rawName) {
        String name = rawName.trim().toLowerCase();
        return tagRepository.findByName(name).orElseGet(() -> {
            Tag t = new Tag();
            t.setName(name);
            return tagRepository.save(t);
        });
    }

    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(TagResponse::from)
                .toList();
    }

    public void saveTags(SaveTagRequest request) {
        for (String name : request.getTagNames()) {
            if (name == null || name.isBlank())
                continue;

            String normalized = name.trim().toLowerCase();
            // ① Tagを取得 or 作成
            Tag tag = tagRepository.findByName(normalized)
                    .orElseGet(() -> {
                        Tag t = new Tag();
                        t.setName(normalized);
                        return tagRepository.save(t);
                    });

            if (profileUserTagRepository.existsByUserIdAndTagIdAndCategory(
                    request.getUserId(),
                    tag.getId(),
                    request.getCategory()
                )) {
                continue;
            }

            // ② user_tag 保存
            ProfileUserTag put = new ProfileUserTag();

            User user = new User();
            user.setId(request.getUserId());

            put.setUser(user);
            put.setTag(tag);
            put.setCategory(request.getCategory());

            profileUserTagRepository.save(put);
        }
    }

}

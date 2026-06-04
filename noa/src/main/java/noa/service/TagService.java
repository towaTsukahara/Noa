package noa.service;

import java.util.List;

import org.springframework.stereotype.Service;

import noa.dto.TagResponse;
import noa.dto.SaveTagRequest;
import noa.entity.ProfileUserTag;
import noa.repository.TagRepository;
import noa.repository.ProfileUserTagRepository;
import noa.entity.Tag;
import noa.entity.User;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final ProfileUserTagRepository profileUserTagRepository;

    public TagService(TagRepository tagRepository,
            ProfileUserTagRepository profileUserTagRepository) {
        this.tagRepository = tagRepository;
        this.profileUserTagRepository = profileUserTagRepository;
    }

    // タグ一覧取得
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(tag -> new TagResponse(
                        tag.getId(),
                        tag.getName(),
                        "TECH")) // tag.getType()を追加？
                .toList();
    }

    // タグ保存
    public void saveTags(SaveTagRequest request) {
        for (Long tagId : request.getTagIds()) {

            ProfileUserTag put = new ProfileUserTag();

            // Tag取得
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Tag not found"));

            put.setTag(tag);

            // UserはIDだけセットでOK（DB参照しなくても可）
            User user = new User();
            user.setId(request.getUserId());
            put.setUser(user);

            put.setCategory(request.getCategory());

            profileUserTagRepository.save(put);
        }
    }
}
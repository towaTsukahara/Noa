package noa.service;

import java.util.List;

import org.springframework.stereotype.Service;

import noa.entity.Tag;
import noa.dto.TagResponse;
import noa.repository.TagRepository;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    // タグ画面の検索・サジェスト（部分一致・上限20件）
    public List<TagResponse> search(String q) {
        if (q == null || q.isBlank())
            return List.of();
        return tagRepository.findByNameContainingIgnoreCaseOrderByName(q.trim())
                .stream().limit(20).map(TagResponse::from).toList();
    }

    // 新規作成のしくみ：正規化して「あれば使う・無ければ作る」（プロフィール保存から呼ばれる）
    public Tag findOrCreate(String rawName){
        String name=rawName.trim().toLowerCase();
        return tagRepository.findByName(name).orElseGet(()->{
            Tag t=new Tag();
            t.setName(name);
            return tagRepository.save(t);
        });
    }

}

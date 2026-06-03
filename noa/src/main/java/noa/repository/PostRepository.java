package noa.repository;

import noa.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 今回は JpaRepository の save() だけ使う。
    // 一覧取得・検索などは F-107（タイムライン）以降で追加していく。
}
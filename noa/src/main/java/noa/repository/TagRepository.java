package noa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import noa.entity.Tag;
import java.util.Optional;

/*
public interface TagRepository extends JpaRepository<Tag, Long> {
}
*/
// TagRepository：名前でタグを1件引く（find-or-create に使う）
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
}

    

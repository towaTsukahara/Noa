package noa.repository;

import noa.entity.ProfileUserTag;
import noa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProfileUserTagRepository extends JpaRepository<ProfileUserTag, Long>{

    List<ProfileUserTag> findByUser(User user);

    @Modifying
    @Query("delete from ProfileUserTag p where p.user = :user")
    void deleteByUser(User user);
}

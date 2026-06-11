package noa.repository;

import noa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByHandle(String handle);

    boolean existsByEmail(String email);

    boolean existsByEmployeeNo(String employeeNo);

    @org.springframework.data.jpa.repository.Query(
        "select max(cast(substring(u.handle, 5) as integer)) from User u where u.handle like 'Noa-%'")
    java.util.Optional<Long> findMaxHandleNumber();
    java.util.List<User> findAllByOrderByIdAsc();
}
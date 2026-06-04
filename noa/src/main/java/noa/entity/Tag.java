package noa.entity;

import java.time.OffsetDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "tags")
public class Tag {
    /*
     * @Id
     * private Long id;
     * private String name;
     * 
     * @Column(name = "created_at")
     * private LocalDateTime createdAt;
     * 
     * public Long getId() {
     * return id;
     * }
     * 
     * public String getName() {
     * return name;
     * }
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}

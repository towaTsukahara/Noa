package noa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_tags", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_tags", columnNames = { "user_id", "tag_id", "category" })
})
public class UserTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;

    @Column(nullable = false)
    private String category;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Tag getTag() { return tag; }
    public void setTag(Tag tag) { this.tag = tag; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}

package noa.security;

import noa.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // 元の User を取り出せるように（コントローラで current user として使う）
    public User getUser() {
        return user;
    }

    public Long getId() {
        return user.getId();
    }

    public String getHandle() {
        return user.getHandle();
    }

    // ロール（USER / ADMIN）を Spring Security の権限として渡す
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // Spring Security 上の「ユーザー名」。Noaでは email を使う
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // アカウントの有効/無効。status が ACTIVE のときだけ有効にする
    @Override
    public boolean isEnabled() {
        return "ACTIVE".equals(user.getStatus());
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
}
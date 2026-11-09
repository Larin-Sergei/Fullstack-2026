import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import styles from "./Header.module.css";

export default function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const username = useAuthStore((state) => state.user?.username);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          TaskFlow
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link to="/tasks">Мои задачи</Link>
              <Link to="/profile">Профиль</Link>
              <span className={styles.username}>{username}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register" className={styles.registerLink}>
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
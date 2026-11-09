
import { Link } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Загрузка профиля...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          Не удалось загрузить данные пользователя.
        </p>
      </main>
    );
  }

  const registrationDate = new Date(
    user.created_at
  ).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <h1>Мой профиль</h1>
        <p>Информация о вашем аккаунте TaskFlow</p>
      </div>

      <section className={styles.card}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>
              Имя пользователя
            </span>
            <span className={styles.value}>
              {user.username}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>
              Email
            </span>
            <span className={styles.value}>
              {user.email}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>
              Дата регистрации
            </span>
            <span className={styles.value}>
              {registrationDate}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>
              ID пользователя
            </span>
            <span className={styles.value}>
              #{user.id}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/tasks" className={styles.primaryButton}>
            Перейти к задачам
          </Link>
        </div>
      </section>
    </main>
  );
}

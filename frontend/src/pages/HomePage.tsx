
import { Link } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            Управление задачами
          </span>

          <h1>
            Организуйте свои дела вместе с{" "}
            <span className={styles.highlight}>
              TaskFlow
            </span>
          </h1>

          <p className={styles.description}>
            Создавайте задачи, устанавливайте приоритеты,
            отслеживайте выполнение и управляйте своим
            временем в одном удобном приложении.
          </p>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <Link
                to="/tasks"
                className={styles.primaryButton}
              >
                Перейти к задачам
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className={styles.primaryButton}
                >
                  Начать бесплатно
                </Link>

                <Link
                  to="/login"
                  className={styles.secondaryButton}
                >
                  Войти в аккаунт
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <span>Мои задачи</span>
            <span className={styles.previewCount}>3 задачи</span>
          </div>

          <div className={styles.previewTask}>
            <span className={styles.taskIndicator} />
            <div>
              <strong>Подготовить презентацию</strong>
              <p>Высокий приоритет</p>
            </div>
          </div>

          <div className={styles.previewTask}>
            <span className={styles.taskIndicator} />
            <div>
              <strong>Изучить React Router</strong>
              <p>Средний приоритет</p>
            </div>
          </div>

          <div className={styles.previewTask}>
            <span
              className={`${styles.taskIndicator} ${styles.completed}`}
            />
            <div>
              <strong>Создать FastAPI backend</strong>
              <p>Завершена</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Всё необходимое для работы с задачами</h2>

        <div className={styles.featureGrid}>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>✓</div>
            <h3>Управление задачами</h3>
            <p>
              Создавайте, редактируйте и удаляйте задачи
              в несколько кликов.
            </p>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>★</div>
            <h3>Приоритеты</h3>
            <p>
              Выделяйте важные дела с помощью низкого,
              среднего и высокого приоритета.
            </p>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>◷</div>
            <h3>Контроль выполнения</h3>
            <p>
              Отслеживайте статусы задач и устанавливайте
              сроки выполнения.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

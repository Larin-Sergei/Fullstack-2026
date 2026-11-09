
import { Link } from "react-router-dom";

import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <span className={styles.errorCode}>404</span>

        <h1>Страница не найдена</h1>

        <p>
          Возможно, страница была удалена
          или вы перешли по неправильному адресу.
        </p>

        <Link to="/" className={styles.homeButton}>
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}

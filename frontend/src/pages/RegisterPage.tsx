import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";
import styles from "./AuthPage.module.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Пароли не совпадают.");
      return;
    }

    try {
      await register(username, email, password);
      navigate("/tasks", { replace: true });
    } catch {
      // Ошибка уже сохраняется в Zustand store.
    }
  }

  return (
    <main className={styles.authPage}>
      <form className={styles.authCard} onSubmit={handleSubmit}>
        <h1>Создать аккаунт</h1>
        <p className={styles.subtitle}>
          Присоединяйтесь к TaskFlow
        </p>

        <label htmlFor="username">Имя пользователя</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          minLength={2}
          maxLength={50}
          placeholder="Ваше имя"
          required
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          required
        />

        <label htmlFor="register-password">Пароль</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          maxLength={128}
          placeholder="Не менее 6 символов"
          required
        />

        <label htmlFor="confirm-password">Повторите пароль</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={6}
          placeholder="Повторите пароль"
          required
        />

        {(validationError || error) && (
          <p className={styles.error}>
            {validationError || error}
          </p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <p className={styles.footer}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </main>
  );
}

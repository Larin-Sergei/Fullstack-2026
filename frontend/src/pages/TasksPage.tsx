import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { useTaskStore } from "../stores/taskStore";
import type { TaskPriority, TaskStatus } from "../types";
import styles from "./TasksPage.module.css";

const statusLabels: Record<TaskStatus, string> = {
  pending: "Ожидает",
  in_progress: "В работе",
  completed: "Завершена",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export default function TasksPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const createTask = useTaskStore((state) => state.createTask);

  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTasks().catch(() => {
      // Ошибка уже сохранена в Zustand.
    });
  }, [fetchTasks]);

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Введите название задачи.");
      return;
    }

    setIsCreating(true);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch {
      setFormError("Не удалось создать задачу. Попробуйте ещё раз.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>Мои задачи</h1>
          <p>Планируйте дела и следите за их выполнением.</p>
        </div>

        <span className={styles.taskCount}>
          Всего задач: {tasks.length}
        </span>
      </div>

      <section className={styles.createSection}>
        <h2>Новая задача</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="task-title">Название</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, подготовить проект"
            maxLength={150}
            required
          />

          <label htmlFor="task-description">Описание</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Дополнительная информация"
            rows={3}
          />

          <div className={styles.formRow}>
            <div>
              <label htmlFor="task-priority">Приоритет</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-due-date">Срок выполнения</label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </div>

          {formError && (
            <p className={styles.error}>{formError}</p>
          )}

          <button type="submit" disabled={isCreating}>
            {isCreating ? "Создание..." : "Добавить задачу"}
          </button>
        </form>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeading}>
          <h2>Список задач</h2>

          <select
            aria-label="Фильтр задач по статусу"
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "all" | TaskStatus)
            }
          >
            <option value="all">Все задачи</option>
            <option value="pending">Ожидают</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершённые</option>
          </select>
        </div>

        {isLoading && tasks.length === 0 && (
          <p className={styles.message}>Загрузка задач...</p>
        )}

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        {!isLoading && !error && filteredTasks.length === 0 && (
          <p className={styles.message}>
            {tasks.length === 0
              ? "У вас пока нет задач. Создайте первую!"
              : "Задач с выбранным статусом нет."}
          </p>
        )}

        <div className={styles.taskList}>
          {filteredTasks.map((task) => (
            <article key={task.id} className={styles.taskCard}>
              <div className={styles.taskInfo}>
                <h3>
                  <Link to={`/tasks/${task.id}`}>
                    {task.title}
                  </Link>
                </h3>

                {task.description && (
                  <p>{task.description}</p>
                )}

                <div className={styles.metadata}>
                  <span>
                    Статус: {statusLabels[task.status]}
                  </span>
                  <span>
                    Приоритет: {priorityLabels[task.priority]}
                  </span>
                  {task.due_date && (
                    <span>Срок: {task.due_date}</span>
                  )}
                </div>
              </div>

              <Link
                to={`/tasks/${task.id}`}
                className={styles.detailsLink}
              >
                Подробнее
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useTaskStore } from "../stores/taskStore";
import type { Task, TaskPriority, TaskStatus } from "../types";
import styles from "./TaskDetailsPage.module.css";

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

interface TaskEditFormProps {
  task: Task;
}

function TaskEditForm({ task }: TaskEditFormProps) {
  const navigate = useNavigate();

  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description ?? ""
  );
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(
    task.priority
  );
  const [dueDate, setDueDate] = useState(task.due_date ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isSubmitting = isSaving || isDeleting;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFormError("");
    setSuccessMessage("");

    if (!title.trim()) {
      setFormError("Название задачи не может быть пустым.");
      return;
    }

    setIsSaving(true);

    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        due_date: dueDate || null,
      });

      setSuccessMessage("Изменения успешно сохранены.");
    } catch {
      setFormError("Не удалось сохранить изменения.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isSubmitting) {
      return;
    }

    const confirmed = window.confirm(
      "Вы действительно хотите удалить эту задачу?"
    );

    if (!confirmed) {
      return;
    }

    setFormError("");
    setSuccessMessage("");
    setIsDeleting(true);

    try {
      await deleteTask(task.id);

      navigate("/tasks", { replace: true });
    } catch {
      setFormError("Не удалось удалить задачу.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.heading}>
        <div>
          <h1>Редактирование задачи</h1>
          <p>Задача №{task.id}</p>
        </div>

        <span className={styles.status}>
          {statusLabels[task.status]}
        </span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="details-title">Название</label>
        <input
          id="details-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={150}
          required
        />

        <label htmlFor="details-description">
          Описание
        </label>
        <textarea
          id="details-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={5}
        />

        <div className={styles.formRow}>
          <div>
            <label htmlFor="details-status">Статус</label>
            <select
              id="details-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TaskStatus)
              }
            >
              <option value="pending">Ожидает</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершена</option>
            </select>
          </div>

          <div>
            <label htmlFor="details-priority">
              Приоритет
            </label>
            <select
              id="details-priority"
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
        </div>

        <label htmlFor="details-due-date">
          Срок выполнения
        </label>
        <input
          id="details-due-date"
          type="date"
          value={dueDate}
          onChange={(event) =>
            setDueDate(event.target.value)
          }
        />

        {formError && (
          <p className={styles.error}>{formError}</p>
        )}

        {successMessage && (
          <p className={styles.success}>{successMessage}</p>
        )}

        <div className={styles.actions}>
          <button type="submit" disabled={isSubmitting}>
            {isSaving
              ? "Сохранение..."
              : "Сохранить изменения"}
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isDeleting
              ? "Удаление..."
              : "Удалить задачу"}
          </button>
        </div>
      </form>

      <div className={styles.additionalInfo}>
        <p>
          <strong>Создана:</strong>{" "}
          {new Date(task.created_at).toLocaleString("ru-RU")}
        </p>

        <p>
          <strong>Последнее изменение:</strong>{" "}
          {new Date(task.updated_at).toLocaleString("ru-RU")}
        </p>

        <p>
          <strong>Приоритет:</strong>{" "}
          {priorityLabels[task.priority]}
        </p>
      </div>
    </section>
  );
}

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);

  const task = useTaskStore((state) => state.selectedTask);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTask = useTaskStore((state) => state.fetchTask);

  const isValidTaskId =
    id !== undefined &&
    /^\d+$/.test(id) &&
    Number.isSafeInteger(taskId) &&
    taskId > 0;

  useEffect(() => {
    if (!isValidTaskId) {
      return;
    }

    fetchTask(taskId).catch(() => {
      // Ошибка уже сохранена в Zustand.
    });
  }, [taskId, isValidTaskId, fetchTask]);

  if (!isValidTaskId) {
    return (
      <main className={styles.page}>
        <h1>Некорректный идентификатор задачи</h1>
        <Link to="/tasks">Вернуться к задачам</Link>
      </main>
    );
  }

  const currentTask =
    task?.id === taskId ? task : null;

  if (isLoading && !currentTask) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          Загрузка задачи...
        </p>
      </main>
    );
  }

  if (error && !currentTask) {
    return (
      <main className={styles.page}>
        <p className={styles.error}>{error}</p>
        <Link to="/tasks">Вернуться к задачам</Link>
      </main>
    );
  }

  if (!currentTask) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          Задача не найдена или ещё не загружена.
        </p>
        <Link to="/tasks">Вернуться к задачам</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link to="/tasks" className={styles.backLink}>
        ← Назад к задачам
      </Link>

      {error && (
        <p className={styles.error}>{error}</p>
      )}

      <TaskEditForm
        key={currentTask.id}
        task={currentTask}
      />
    </main>
  );
}

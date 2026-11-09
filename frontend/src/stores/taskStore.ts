
import { create } from "zustand";

import type { Task, TaskCreate, TaskUpdate } from "../types";
import * as tasksApi from "../api/tasks";

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  fetchTask: (taskId: number) => Promise<void>;
  createTask: (data: TaskCreate) => Promise<Task>;
  updateTask: (taskId: number, data: TaskUpdate) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });

    try {
      const tasks = await tasksApi.getTasks();

      set({
        tasks,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: "Не удалось загрузить задачи.",
      });

      throw new Error("Failed to load tasks");
    }
  },

  fetchTask: async (taskId) => {
    set({
      isLoading: true,
      error: null,
      selectedTask: null,
    });

    try {
      const task = await tasksApi.getTask(taskId);

      set({
        selectedTask: task,
        isLoading: false,
      });
    } catch {
      set({
        selectedTask: null,
        isLoading: false,
        error: "Не удалось загрузить задачу.",
      });

      throw new Error("Failed to load task");
    }
  },

  createTask: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const task = await tasksApi.createTask(data);

      set((state) => ({
        tasks: [task, ...state.tasks],
        isLoading: false,
      }));

      return task;
    } catch {
      set({
        isLoading: false,
        error: "Не удалось создать задачу.",
      });

      throw new Error("Failed to create task");
    }
  },

  updateTask: async (taskId, data) => {
    set({ isLoading: true, error: null });

    try {
      const updatedTask = await tasksApi.updateTask(taskId, data);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
        selectedTask:
          state.selectedTask?.id === taskId
            ? updatedTask
            : state.selectedTask,
        isLoading: false,
      }));

      return updatedTask;
    } catch {
      set({
        isLoading: false,
        error: "Не удалось обновить задачу.",
      });

      throw new Error("Failed to update task");
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null });

    try {
      await tasksApi.deleteTask(taskId);

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        selectedTask:
          state.selectedTask?.id === taskId
            ? null
            : state.selectedTask,
        isLoading: false,
      }));
    } catch {
      set({
        isLoading: false,
        error: "Не удалось удалить задачу.",
      });

      throw new Error("Failed to delete task");
    }
  },

  clearTasks: () => {
    set({
      tasks: [],
      selectedTask: null,
      error: null,
      isLoading: false,
    });
  },
}));

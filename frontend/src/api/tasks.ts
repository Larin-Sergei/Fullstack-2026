
import { apiClient } from "./client";
import type { Task, TaskCreate, TaskUpdate } from "../types";

export async function getTasks(): Promise<Task[]> {
  const response = await apiClient.get<Task[]>("/tasks/");
  return response.data;
}

export async function getTask(taskId: number): Promise<Task> {
  const response = await apiClient.get<Task>(`/tasks/${taskId}`);
  return response.data;
}

export async function createTask(data: TaskCreate): Promise<Task> {
  const response = await apiClient.post<Task>("/tasks/", data);
  return response.data;
}

export async function updateTask(
  taskId: number,
  data: TaskUpdate
): Promise<Task> {
  const response = await apiClient.patch<Task>(
    `/tasks/${taskId}`,
    data
  );

  return response.data;
}

export async function deleteTask(taskId: number): Promise<void> {
  await apiClient.delete(`/tasks/${taskId}`);
}

import { CreateTaskReq, Task } from "../types";

export const getTasks = async (
  jwtToken: string,
  refreshToken: string,
  onError: () => void
): Promise<Task[] | void> => {
  try {
    const res = await fetch("/api/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        RefreshToken: refreshToken,
      },
    });

    const tasks: Task[] = await res.json();
    return tasks;
  } catch (e) {
    console.error(e);
    onError();
  }
};

export const postTask = async (
  jwtToken: string,
  refreshToken: string,
  taskBody: CreateTaskReq,
  onError: () => void
): Promise<Task | void> => {
  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        RefreshToken: refreshToken,
      },
      body: JSON.stringify(taskBody),
    });

    if (res.status == 201) {
      const task: Task = await res.json();
      return task;
    } else {
      onError();
    }
  } catch (e) {
    console.error(e);
    onError();
  }
};

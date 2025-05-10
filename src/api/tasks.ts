import { CreateTaskReq, Task, UpdateTaskReq } from "../types";

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

export const deleteTask = async (
  jwtToken: string,
  refreshToken: string,
  taskId: string,
  onError: () => void
): Promise<number | void> => {
  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        RefreshToken: refreshToken,
      },
    });

    if (res.status === 200) {
      return res.status;
    } else {
      onError();
    }
  } catch (e) {
    console.error(e);
    onError();
  }
};

export const putTask = async (
  jwtToken: string,
  refreshToken: string,
  taskId: string,
  taskBody: UpdateTaskReq,
  onError: () => void
): Promise<number | void> => {
  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        RefreshToken: refreshToken,
      },
      body: JSON.stringify(taskBody),
    });

    if (res.status === 200) {
      return res.status;
    } else {
      onError();
    }
  } catch (e) {
    console.error(e);
    onError();
  }
};

export const getTaskById = async (
  jwtToken: string,
  refreshToken: string,
  taskId: string,
  onError: () => void
): Promise<Task | void> => {
  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        RefreshToken: refreshToken,
      },
    });

    if (res.status === 200) {
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

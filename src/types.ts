export type UserInfo = {
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type UserInfoReq = {
  email?: string;
  username?: string;
  password?: string;
};

export type Task = {
  id: string;
  created_at: string;
  updated_at: string;
  due_until: string;
  title: string;
  description: string;
  priority: number;
  category: string;
  user_id: string;
};

export type CreateTaskReq = {
  title: string;
  description: string;
  priority: number;
  category: string;
  due_until: string;
};

export type UpdateTaskReq = {
  title?: string;
  description?: string;
  priority?: number;
  category?: string;
  due_until?: string;
};

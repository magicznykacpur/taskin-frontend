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

import { UserInfo, UserInfoReq } from "../types";

export const getUserInfo = async (
  jwtToken: string,
  refreshToken: string,
  onError: () => void
): Promise<UserInfo | void> => {
  try {
    const res = await fetch("/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        RefreshToken: refreshToken,
      },
    });

    const user: UserInfo = await res.json();
    return user;
  } catch (e) {
    console.error(e);
    onError();
  }
};

export const updateUserInfo = async (
  jwtToken: string,
  refreshToken: string,
  reqBody: UserInfoReq,
  onError: () => void
): Promise<UserInfo | void> => {
  try {
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        RefreshToken: refreshToken,
      },
      body: JSON.stringify(reqBody),
    });

    const user: UserInfo = await res.json();
    return user;
  } catch (e) {
    console.error(e);
    onError();
  }
};

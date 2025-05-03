import { UserInfo } from "../types";

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

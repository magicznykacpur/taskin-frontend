import { atomWithStorage } from "jotai/utils";
import { UserInfo } from "../types";

export const userAtom = atomWithStorage<UserInfo>(
  "taskin-user",
  {} as UserInfo
);

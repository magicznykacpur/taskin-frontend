import { atomWithStorage } from "jotai/utils";
import { Task } from "../types";

export const tasksAtom = atomWithStorage<Task[]>(
    "tasks",
    [] as Task[]
);

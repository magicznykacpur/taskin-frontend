import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTasks } from "../../../api/tasks";
import { tasksAtom } from "../../../atoms/tasks";
import useTokens from "../../../hooks/useTokens";
import { Skeleton } from "../../../components/ui/skeleton";
import TaskCard from "./task-card";

type FetchingTasksState = "fetching" | "success" | "error";

const skeletonList = Array.from(Array(20).keys());

const Tasks = () => {
  const [fetchingTasksState, setFetchingTasksState] =
    useState<FetchingTasksState>("fetching");
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [jwtToken, refreshToken] = useTokens();

  const fetchTasks = async () => {
    setFetchingTasksState("fetching");

    const data = await getTasks(jwtToken, refreshToken, () => {
      setFetchingTasksState("error");
      toast.error("Couldnt fetch your tasks.");
    });

    if (data != undefined) {
      setFetchingTasksState("success");
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {fetchingTasksState == "fetching" && (
        <div className="grid p-10 lg:grid-cols-6 lg:gap-10 md:grid-cols-3 md:gap-10 sm:grid-cols-2">
          {skeletonList.map((key) => (
            <Skeleton
              key={key}
              className="bg-gray-300 h-[272px] w-[267px] rounded-md"
            />
          ))}
        </div>
      )}

      {fetchingTasksState == "success" && (
        <div className="grid p-10 lg:grid-cols-6 lg:gap-10 md:grid-cols-3 md:gap-10 sm:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      )}

      {fetchingTasksState === "error" && (
        <div className="flex justify-center my-10 text-rose-300">
          Something went wrong while fetching your task, try refreshing the
          page.
        </div>
      )}
    </>
  );
};

export default Tasks;

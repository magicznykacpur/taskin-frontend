import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTasks } from "../../../api/tasks";
import { tasksAtom } from "../../../atoms/tasks";
import useTokens from "../../../hooks/useTokens";
import { Skeleton } from "../../../components/ui/skeleton";
import TaskCard from "./task-card";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router";

type FetchingTasksStatus = "fetching" | "success" | "error";

const skeletonList = Array.from(Array(20).keys());

const Tasks = () => {
  const navigate = useNavigate();
  const [fetchingTasksStatus, setFetchingTasksStatus] =
    useState<FetchingTasksStatus>("fetching");
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [jwtToken, refreshToken] = useTokens();

  const fetchTasks = async () => {
    setFetchingTasksStatus("fetching");

    const data = await getTasks(jwtToken, refreshToken, () => {
      setFetchingTasksStatus("error");
      toast.error("Couldnt fetch your tasks.");
    });

    if (data != undefined) {
      setFetchingTasksStatus("success");
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {fetchingTasksStatus === "fetching" && (
        <div className="grid p-10 gap-5 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
          {skeletonList.map((key) => (
            <Skeleton
              key={key}
              className="bg-white h-[272px] w-[267px] rounded-md"
            />
          ))}
        </div>
      )}

      {fetchingTasksStatus === "success" && (
        <div className="grid p-10 gap-5 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
          {tasks.length === 0 ? (
            <div className="flex items-center absolute my-5 text-2xl text-white">
              <span>You don't have any tasks yet... </span>
              <Button
                className="text-black ml-5"
                variant="outline"
                onClick={() => navigate("/dashboard/new-task")}
              >
                Add some!
              </Button>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} {...task} />)
          )}
        </div>
      )}

      {fetchingTasksStatus === "error" && (
        <div className="flex justify-center my-10 text-rose-300">
          Something went wrong while fetching your task, try refreshing the
          page.
        </div>
      )}
    </>
  );
};

export default Tasks;

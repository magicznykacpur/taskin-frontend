import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getSearchTasks, getTasks } from "../../../api/tasks";
import { tasksAtom } from "../../../atoms/tasks";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import useTokens from "../../../hooks/useTokens";
import TaskCard from "./task-card";
import { Input } from "../../../components/ui/input";
import useDebounce from "../../../hooks/useDebounce";

type FetchingTasksStatus = "fetching" | "success" | "error" | "no-tasks-found";

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

  const searchTasks = useDebounce(async (searchString: string) => {
    setFetchingTasksStatus("fetching");
    if (searchString === "") {
      fetchTasks();
      return;
    }

    const tasks = await getSearchTasks(
      jwtToken,
      refreshToken,
      searchString,
      () => {
        setFetchingTasksStatus("error");
        toast.error("Something went wrong when searching for tasks");
      }
    );

    if (tasks && tasks.length === 0) {
      setFetchingTasksStatus("no-tasks-found");
    } else {
      setFetchingTasksStatus("success");
      setTasks(tasks!);
    }
  }, 500);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="flex justify-center mt-5">
        <Input
          className="w-2/3 text-white"
          placeholder="search"
          onChange={(event) => searchTasks(event.target.value)}
        />
      </div>
      
      {fetchingTasksStatus === "no-tasks-found" && (
        <div className="flex justify-center my-10 text-rose-300 text-2xl">
          We couldn't find any tasks matching this title or description...
        </div>
      )}

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
        <div className="flex justify-center my-10 text-rose-300 text-2xl">
          Something went wrong while fetching your task, try refreshing the
          page.
        </div>
      )}
    </>
  );
};

export default Tasks;

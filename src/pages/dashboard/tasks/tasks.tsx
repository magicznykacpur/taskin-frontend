import { useAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";
import { getTasks } from "../../../api/tasks";
import { tasksAtom } from "../../../atoms/tasks";
import useTokens from "../../../hooks/useTokens";

const Tasks = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [jwtToken, refreshToken] = useTokens();

  const fetchTasks = async () => {
    const data = await getTasks(jwtToken, refreshToken, () =>
      toast.error("Couldnt fetch your tasks.")
    );

    data && setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return <></>;
};

export default Tasks;

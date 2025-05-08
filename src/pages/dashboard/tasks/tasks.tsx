import { useAtom } from "jotai";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { getTasks } from "../../../api/tasks";
import { tasksAtom } from "../../../atoms/tasks";

const Tasks = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [cookies] = useCookies();
  const jwtToken = cookies["jwt_token"];
  const refreshToken = cookies["refresh_token"];

  const fetchTasks = async () => {
    const data = await getTasks(jwtToken, refreshToken, () =>
      toast.error("Couldnt fetch your tasks.")
    );

    data && setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);
};

export default Tasks;

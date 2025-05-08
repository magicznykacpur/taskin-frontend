import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Task } from "../../../types";
import { formatDate } from "date-fns";
import useTokens from "../../../hooks/useTokens";
import { deleteTask } from "../../../api/tasks";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import useOnClickOustide from "../../../hooks/useOnClickOutside";
import { useAtom } from "jotai";
import { tasksAtom } from "../../../atoms/tasks";

type DeleteTaskStatus = "idle" | "deleting" | "success" | "error";

const TaskCard = ({ id, title, description, due_until }: Task) => {
  const [deleteStatus, setDeleteStatus] = useState<DeleteTaskStatus>("idle");

  const [deletePopoverOpen, setDeletePopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef(null);
  useOnClickOustide(popoverRef, () => setDeletePopoverOpen(false));

  const [jwtToken, refreshToken] = useTokens();
  const formattedDate = formatDate(due_until, "dd-MM-yyyy");

  const handleXClick = () => {
    if (deleteStatus !== "deleting") {
      setDeletePopoverOpen(true);
    }
  };

  const [tasks, setTasks] = useAtom(tasksAtom);

  const submitDeleteTask = async () => {
    setDeletePopoverOpen(false);
    setDeleteStatus("deleting");

    const status = await deleteTask(jwtToken, refreshToken, id, () => {
      setDeleteStatus("error");
      toast.error("Something went wrong while deleting your task...");
    });

    if (status !== undefined) {
      setTasks(tasks.filter((task) => task.id !== id));

      setDeleteStatus("success");
      toast.success("Task deleted!");
    }
  };

  return (
    <Card
      className={deleteStatus === "deleting" ? "bg-accent animate-pulse" : ""}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Popover open={deletePopoverOpen}>
            <PopoverTrigger asChild>
              <X
                onClick={() => handleXClick()}
                color="#F8A1AD"
                size={24}
                strokeWidth="4px"
                className="cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent ref={popoverRef} className="bg-rose-50 py-10">
              <div className="space-y-6">
                <CardHeader>
                  <CardTitle>Deleting task {title}</CardTitle>
                </CardHeader>
                <CardContent>
                  Are you sure you want to delete this task?
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => setDeletePopoverOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="ml-3"
                    onClick={() => submitDeleteTask()}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </div>
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-30">{description}</CardContent>
      <CardFooter>
        <span className="mr-2">Task due until</span>
        <strong>{formattedDate}</strong>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;

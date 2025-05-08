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

const TaskCard = ({ id, title, description, due_until }: Task) => {
  const formattedDate = formatDate(due_until, "dd-MM-yyyy");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <X
            color="#F8A1AD"
            size={24}
            strokeWidth="4px"
            className="cursor-pointer"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-30">{description}</CardContent>
      <CardFooter>
        <span className="mr-2">Task due until</span>{" "}
        <strong>{formattedDate}</strong>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;

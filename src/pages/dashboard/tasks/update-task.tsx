import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatRFC3339 } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { getTaskById, putTask } from "../../../api/tasks";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Skeleton } from "../../../components/ui/skeleton";
import { needAtLeast } from "../../../helpers/form";
import useTokens from "../../../hooks/useTokens";
import { cn } from "../../../lib/utils";
import { Task } from "../../../types";

type FetchingStatus = "idle" | "fetching" | "success" | "error";
type UpdateStatus = "idle" | "updating" | "success" | "error";

const UpdateTask = () => {
  const [jwtToken, refreshToken] = useTokens();
  let params = useParams();
  const taskId = params.id;
  const [updatableTask, setUpdatableTask] = useState<Task | undefined>(
    undefined
  );
  const [fetchingStatus, setFetchingStatus] = useState<FetchingStatus>("idle");

  const fetchTask = async () => {
    setFetchingStatus("fetching");
    const task = await getTaskById(jwtToken, refreshToken, taskId!, () => {
      setFetchingStatus("error");
      toast.error("Something went wrong while fetching your task...");
    });

    if (task !== undefined) {
      setFetchingStatus("success");
      setUpdatableTask(task);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");
  const newTaskFormSchema = z.object({
    due_until: z
      .date({ required_error: "Due date is required." })
      .or(z.undefined()),
    title: z.string().min(3, needAtLeast(3, "title")).or(z.undefined()),
    description: z
      .string()
      .min(3, needAtLeast(3, "description"))
      .or(z.undefined()),
    priority: z.number().min(0, "Must be at least 0.").or(z.undefined()),
    category: z.string().min(3, needAtLeast(3, "category")).or(z.undefined()),
  });

  const form = useForm<z.infer<typeof newTaskFormSchema>>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues: {
      due_until: undefined,
      title: undefined,
      description: undefined,
      priority: undefined,
      category: undefined,
    },
  });

  const onSubmit = async () => {
    setUpdateStatus("updating");

    try {
      const { due_until, title, description, priority, category } =
        form.getValues();

      if (
        due_until === undefined &&
        title === undefined &&
        description === undefined &&
        priority === undefined &&
        category === undefined
      ) {
        setUpdateStatus("idle");
        toast.warning("You must pass at least one value to update.");
        return;
      }

      const formattedDueUntil = due_until
        ? formatRFC3339(due_until)
        : undefined;

      const taskBody = {
        due_until: formattedDueUntil,
        title,
        description,
        priority,
        category,
      };

      const task = await putTask(
        jwtToken,
        refreshToken,
        updatableTask!.id,
        taskBody,
        () => {
          setUpdateStatus("error");
          toast.error("Something went wrong while creating your task...");
        }
      );

      if (task != undefined) {
        setUpdateStatus("success");
        toast.success("Task created successfully!");
      }
    } catch (e) {
      setUpdateStatus("error");
      toast.error("Something went wrong...");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {fetchingStatus === "fetching" && (
        <Skeleton className="mt-10 w-2/3 max-w-[670px] min-w-[480px] h-[502px]" />
      )}

      {fetchingStatus === "error" && (
        <div className="text-rose-300 text-xl mt-10 w-2/3 max-w-[670px] min-w-[480px]">
          Something went wrong while fetching this task. Please try refreshing
          the page.
        </div>
      )}

      {fetchingStatus === "success" && (
        <Card className="mt-10 w-2/3 max-w-[670px] min-w-[480px]">
          <CardHeader>
            <CardTitle>Update task</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col"
              >
                <FormField
                  control={form.control}
                  name="due_until"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due until</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const yesterday = new Date();
                              yesterday.setDate(new Date().getDate() - 1);
                              return date < yesterday;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={updatableTask?.title} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={updatableTask?.description}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={updatableTask?.category}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={`${updatableTask?.priority}`}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col items-end justify-end">
                  <Button
                    type="submit"
                    {...(updateStatus == "updating" && { disabled: true })}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      <div className="w-2/3 mt-10 flex justify-start">
        {updateStatus == "success" && (
          <Label className="text-green-200 align-self-start">
            Your task was updated!
          </Label>
        )}
        {updateStatus == "error" && (
          <Label className="text-rose-300 align-self-start">
            Something went wrong while updating your task, please try again.
          </Label>
        )}
      </div>
    </div>
  );
};

export default UpdateTask;

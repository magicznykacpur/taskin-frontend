import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatRFC3339 } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { postTask } from "../../../api/tasks";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import useTokens from "../../../hooks/useTokens";
import { cn } from "../../../lib/utils";
import { Label } from "../../../components/ui/label";
import { needAtLeast } from "../../../helpers/form";

type CreationStatus = "idle" | "creating" | "success" | "error";

const NewTask = () => {
  const [jwtToken, refreshToken] = useTokens();
  const [creationStatus, setCreationStatus] = useState<CreationStatus>("idle");

  const newTaskFormSchema = z.object({
    due_until: z.date({ required_error: "Due date is required." }),
    title: z.string().min(3, needAtLeast(3, "title")),
    description: z.string().min(3, needAtLeast(3, "description")),
    priority: z.number().min(0, "Must be at least 0."),
    category: z.string().min(3, needAtLeast(3, "category")),
  });

  const form = useForm<z.infer<typeof newTaskFormSchema>>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues: {
      due_until: new Date(),
      title: "",
      description: "",
      priority: 0,
      category: "",
    },
  });

  const onSubmit = async () => {
    setCreationStatus("creating");

    try {
      const { due_until, title, description, priority, category } =
        form.getValues();
      const taskBody = {
        due_until: formatRFC3339(due_until),
        title,
        description,
        priority,
        category,
      };

      const task = await postTask(jwtToken, refreshToken, taskBody, () => {
        setCreationStatus("error");
        toast.error("Something went wrong while creating your task...");
      });

      if (task != undefined) {
        setCreationStatus("success");
        task && toast.success("Task created successfully!");
      }
    } catch (e) {
      setCreationStatus("error");
      toast.error("Something went wrong...");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="mt-10 w-2/3">
        <CardHeader>
          <CardTitle>Create new task</CardTitle>
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                  {...(creationStatus == "creating" && { disabled: true })}
                >
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="w-2/3 mt-10 flex justify-start">
        {creationStatus == "success" && (
          <Label className="text-green-200 align-self-start">
            Your task was created!
          </Label>
        )}
        {creationStatus == "error" && (
          <Label className="text-rose-300 align-self-start">
            Something went wrong while creating your task, please try again.
          </Label>
        )}
      </div>
    </div>
  );
};

export default NewTask;

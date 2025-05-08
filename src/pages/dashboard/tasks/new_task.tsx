import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { postTask } from "../../../api/tasks";
import { Button } from "../../../components/ui/button";
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
import useTokens from "../../../hooks/useTokens";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { cn } from "../../../lib/utils";
import { format } from "date-fns";

const needAtLeast = (characters: number, field: string) =>
  `Need at least ${characters} characters for the ${field}`;

const NewTask = () => {
  const [jwtToken, refreshToken] = useTokens();

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
    try {
      const { due_until, title, description, priority, category } =
        form.getValues();
      const taskBody = {
        due_until: due_until.toUTCString(),
        title,
        description,
        priority,
        category,
      };

      const task = await postTask(jwtToken, refreshToken, taskBody, () =>
        toast.error("Something went wrong while creating your task...")
      );
      console.log(task);
    } catch (e) {
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
              <div className="flex justify-end">
                <Button type="submit">Create</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTask;

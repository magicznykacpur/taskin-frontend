import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { postTask } from "../../../api/tasks";
import useTokens from "../../../hooks/useTokens";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const needAtLeast = (characters: number, field: string) =>
  `Need at least ${characters} for the ${field}`;

const NewTask = () => {
  const [jwtToken, refreshToken] = useTokens();

  const newTaskFormSchema = z.object({
    due_until: z.date(),
    title: z.string().min(3, needAtLeast(3, "title")),
    description: z.string().min(3, needAtLeast(3, "description")),
    priority: z.number().min(1, "Must be at least 1."),
    category: z.string().min(3, needAtLeast(3, "category")),
  });

  const form = useForm<z.infer<typeof newTaskFormSchema>>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues: {
      due_until: new Date(),
      title: "",
      description: "",
      priority: 1,
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
      <Card className="mt-10 w-1/2">
        <CardHeader>
          <CardTitle>Log in to Taskin</CardTitle>
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
                  <FormItem>
                    <FormControl>{/* <Input {...field} /> */}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="title" {...field} />
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
                    <FormControl>
                      <Input placeholder="description" {...field} />
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
                    <FormControl>
                      <Input placeholder="category" {...field} />
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
                    <FormControl>
                      <Input placeholder="priority" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Log in</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTask;

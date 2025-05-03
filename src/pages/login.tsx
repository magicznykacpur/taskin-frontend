import { zodResolver } from "@hookform/resolvers/zod";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import Breadcrumbs from "../components/breadcrumbs";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";

const Login = () => {
  const loginFormSchema = z.object({
    email: z.string().email("This is not a valid email."),
    password: z.string().min(1, "This field cannot be empty"),
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [_, setCookie] = useCookies();
  const onSubmit = async () => {
    try {
      const { email, password } = form.getValues();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();
      if (res.status !== 200 && data?.error_message !== "") {
        toast.warning("Invalid email or password");
        console.error(data?.error_message);
      } else {
        setCookie("jwt_token", data?.jwt_token);
        setCookie("refresh_token", data?.refresh_token);
        navigate("/dashboard/tasks");
      }
    } catch (e) {
      toast.error("Something went wrong...");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Breadcrumbs links={{ "/": "Home", "/login": "Login" }} />
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
                        {...field}
                      />
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

export default Login;

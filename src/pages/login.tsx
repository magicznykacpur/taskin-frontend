import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Breadcrumbs from "../components/breadcrumbs";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useCookies } from "react-cookie";

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

  const [_, setCookie] = useCookies();
  const onSubmit = async () => {
    try {
      const formValues = form.getValues();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      const data = await res.json();
      if (res.status !== 200 && data?.error_message !== "") {
        toast("Invalid email or password");
        console.error(data?.error_message);
      } else {
        setCookie("jwt_token", data?.jwt_token);
        setCookie("refresh_token", data?.refresh_token);
      }
    } catch (e) {
      toast("Something went wrong...");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Breadcrumbs links={{ "/": "Home", "/login": "Login" }} />
      <h1 className="text-white mt-10 mb-5">Log in to Taskin</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col"
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
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-4">
            <Button variant="outline" type="submit">
              Log in
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;

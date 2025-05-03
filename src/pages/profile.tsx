import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateUserInfo } from "../api/user";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { UserInfo } from "../types";
import { userAtom } from "./dashboard";

const Profile = () => {
  const [cookie] = useCookies();
  const [userInfo, setUserInfo] = useAtom(userAtom);
  const jwtToken = cookie["jwt_token"];
  const refreshToken = cookie["refresh_token"];

  const updateProfileFormSchema = z.object({
    email: z.string().email("This is not a valid email.").or(z.undefined()),
    username: z
      .string()
      .min(4, "This field must have at least 4 characters.")
      .or(z.undefined()),
    password: z
      .string()
      .min(1, "This field cannot be empty.")
      .or(z.undefined()),
  });

  const form = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      email: undefined,
      username: undefined,
      password: undefined,
    },
  });

  const onSubmit = async () => {
    const { email, username, password } = form.getValues();
    if (
      email === undefined &&
      username === undefined &&
      password === undefined
    ) {
      toast("You must pass at least one value to update.");
    }

    const userInfo = await updateUserInfo(
      jwtToken,
      refreshToken,
      { email, username, password },
      () => toast("Something went wrong when updating your profile.")
    );
    setUserInfo(userInfo);

    toast.success("Profile updated successfully!")
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="mt-20 w-1/2">
        <CardHeader>
          <CardTitle>Your profile data</CardTitle>
          <CardDescription>update your profile data here</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder={userInfo?.email} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder={userInfo?.username} {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Update</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

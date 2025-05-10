import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateUserInfo } from "../../api/user";
import { userAtom } from "../../atoms/user";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import useTokens from "../../hooks/useTokens";
import { formatDate } from "date-fns";
import { useState } from "react";
import { Label } from "../../components/ui/label";

type ProfileUpdateStatus = "idle" | "updating" | "success" | "error";

const Profile = () => {
  const [updateStatus, setUpdateStatus] =
    useState<ProfileUpdateStatus>("idle");
  const [userInfo, setUserInfo] = useAtom(userAtom);
  const [jwtToken, refreshToken] = useTokens();

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
    setUpdateStatus("updating");
    const { email, username, password } = form.getValues();
    if (
      email === undefined &&
      username === undefined &&
      password === undefined
    ) {
      setUpdateStatus("idle")
      toast.warning("You must pass at least one value to update.");
      return;
    }

    const userInfo = await updateUserInfo(
      jwtToken,
      refreshToken,
      { email, username, password },
      () => {
        setUpdateStatus("error");
        toast.error("Something went wrong when updating your profile.");
      }
    );

    if (userInfo !== undefined) {
      setUpdateStatus("success");
      userInfo && setUserInfo(userInfo);
      toast.success("Profile updated successfully!");
    }
  };

  const formattedDate = formatDate(userInfo.updated_at, "dd-MMMM-yyyy kk:mm");

  return (
    <div className="flex flex-col items-center">
      <Card className="mt-10 w-2/3">
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
              <CardDescription>
                last updated at <strong>{formattedDate}</strong>
              </CardDescription>
              <div className="flex justify-end">
                <Button
                  {...(updateStatus === "updating" && { disabled: true })}
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="w-2/3 mt-10 flex justify-start">
        {updateStatus == "success" && (
          <Label className="text-green-200 align-self-start">
            Profile updated!
          </Label>
        )}
        {updateStatus == "error" && (
          <Label className="text-rose-300 align-self-start">
            Something went wrong while updating your profile, please try again.
          </Label>
        )}
      </div>
    </div>
  );
};

export default Profile;

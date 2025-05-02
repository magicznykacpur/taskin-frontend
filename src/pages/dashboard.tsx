import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router";
import { toast } from "sonner";
import { UserInfo } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const userAtom = atom<UserInfo>();

const Dashboard = () => {
  const [cookie] = useCookies();
  const jwtToken = cookie["jwt_token"];
  const refreshToken = cookie["refresh_token"];

  if (jwtToken === undefined || refreshToken === undefined)
    return <Navigate to="/" />;

  const [user, setUser] = useAtom(userAtom);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          RefreshToken: refreshToken,
        },
      });

      const user: UserInfo = await res.json();
      setUser(user);
    } catch (e) {
      console.error(e);
      toast("Something went wrong while fetching the user...");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <header className="sticky flex justify-between p-4 text-white border-b-2 border-b-gray-600">
        <strong>taskin</strong>
        <div className="flex space-x-4">
          <strong>{user?.username}</strong>
          <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default Dashboard;

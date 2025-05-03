import { } from "@radix-ui/react-dropdown-menu";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import menu from "../assets/menu.svg";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { UserInfo } from "../types";

export const userAtom = atom<UserInfo>();

const Dashboard = () => {
  const navigate = useNavigate();
  const [cookie, _, removeCookie] = useCookies();
  const jwtToken = cookie["jwt_token"];
  const refreshToken = cookie["refresh_token"];

  const logout = () => {
    removeCookie("jwt_token");
    removeCookie("refresh_token");
    navigate("/");
  };

  if (jwtToken === undefined || refreshToken === undefined) {
    () => navigate("/")
  }
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
    <>
      <header className="sticky flex justify-between items-center p-4 text-white border-b-2 border-b-gray-600">
        <strong>taskin</strong>
        <div className="flex items-center space-x-4">
          <strong>{user?.username}</strong>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <img src={menu} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard/tasks")}>
                Tasks
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Dashboard;

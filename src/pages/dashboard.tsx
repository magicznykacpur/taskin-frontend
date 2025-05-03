import {} from "@radix-ui/react-dropdown-menu";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { NavLink, Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import { getUserInfo } from "../api/user";
import menu from "../assets/menu.svg";
import { userAtom } from "../atoms/user";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

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
    () => navigate("/");
  }

  const [user, setUser] = useAtom(userAtom);
  const fetchUser = async () => {
    const userInfo = await getUserInfo(jwtToken, refreshToken, () =>
      toast.error("Something went wrong when fetching the user.")
    );

    userInfo && setUser(userInfo);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <header className="sticky flex justify-between items-center p-4 text-white border-b-2 border-b-gray-600">
        <NavLink to="/dashboard/tasks">
          <strong>taskin</strong>
        </NavLink>
        <div className="flex items-center space-x-4">
          <strong>{user?.username}</strong>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <img src={menu} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="justify-center"
                onClick={() => navigate("/dashboard/profile")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-center"
                onClick={() => navigate("/dashboard/tasks")}
              >
                Tasks
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="justify-center"
                onClick={() => logout()}
              >
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

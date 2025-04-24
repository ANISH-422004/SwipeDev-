import React, { useContext } from "react";
import { ThemeProviderContext } from "../context/ThemeProvider";
import { ModeToggle } from "./mode-toggle";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeUser } from "@/app/slices/userSlice";
import { toast } from "sonner";

const NavBar = () => {
  const { theme } = useContext(ThemeProviderContext);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      className="fixed top-0 left-0 w-full z-50 p-4"
      style={{
        background:
          theme === "dark"
            ? "rgba(18, 18, 18, 0.5)"
            : "rgba(255, 255, 255, 0.5)",
        color: theme === "dark" ? "white" : "black",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom:
          theme === "dark"
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        isolation: "isolate",
      }}
    >
      <div className="flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-10" />
        </Link>
        <div className="flex space-x-6">
          <div className="flex justify-center items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {" "}
                  <img
                    src={user.profilePic}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full shadow-md ring-1 ring-white hover:scale-105 transition-transform duration-300"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("token");
                      dispatch(removeUser());
                      toast.success("Logout Successfull");
                      navigate("/");
                    }}
                    className="bg-red-500 text-white  active:bg-red-700"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="flex items-center space-x-2">
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavBar;

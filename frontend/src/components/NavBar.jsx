import React, { useContext } from "react";
import { ThemeProviderContext } from "../context/ThemeProvider";
import { ModeToggle } from "./mode-toggle";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const { theme } = useContext(ThemeProviderContext);
  const user = useSelector((state) => state.user);
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
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
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

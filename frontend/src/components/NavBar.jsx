import React, { useContext } from "react";
import { ThemeProviderContext } from "../context/ThemeProvider";
import { ModeToggle } from "./mode-toggle";
import logo from "../assets/logo.svg";
const NavBar = () => {
  const { theme } = useContext(ThemeProviderContext);

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
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          {/* <div className="text-2xl font-bold">My Logo</div> */}
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-[var(--accent-foreground)]">
            Home
          </a>
          <a href="#" className="hover:text-[var(--accent-foreground)]">
            About
          </a>
          <a href="#" className="hover:text-[var(--accent-foreground)]">
            Services
          </a>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavBar;

import React from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import NavBar from "./components/NavBar";
import Approutes from "./routes/Approutes";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <div className="Dark-theme">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />
        <div className="mt-20 px-2">
          {/* Routes  */}
            <Approutes />
        </div>
        <Footer/>
        <Toaster />
      </ThemeProvider>
    </div>
  );
};

export default App;

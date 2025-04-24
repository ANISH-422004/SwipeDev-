import { setConnections } from "@/app/slices/connectionsSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connections);

  const fetchConnections = async () => {
    try {
      const res = await axiosInstance.get("api/v1/connections/connections/");
      dispatch(setConnections(res.data.connections));
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen p-6 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Connections</h1>

      <div className="flex flex-col items-center justify-center gap-4 overflow-x-auto w-full px-4 py-52 border-2 pb-4">
        {connections && connections.length > 0 ? (
          connections.map((connection) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-full max-w-3xl"
            >
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300  w-[100%]">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <img
                    src={connection.profilePic}
                    alt="User Avatar"
                    className="w-14 h-14 rounded-full shadow ring ring-white hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold">
                      {connection.firstName + " " + connection.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
                      <UserCircle2 className="w-4 h-4" />
                      {connection.gender || "Not specified"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground px-4 pb-4 pt-0">
                  {connection.about || "No description provided."}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No connections found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Connections;

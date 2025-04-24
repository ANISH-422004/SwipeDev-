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

      <div className="flex gap-4 overflow-x-auto w-full px-4 pb-4">
        {connections && connections.length > 0 ? (
          connections.map((connection) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-80"
            >
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center space-y-2">
                  <img
                    src={connection.profilePic}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full shadow ring ring-white hover:scale-105 transition-transform duration-300"
                  />
                  <CardTitle className="text-lg font-semibold">
                    {connection.firstName + " " + connection.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground">
                    <UserCircle2 className="w-4 h-4" />
                    {connection.gender || "Not specified"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-center text-muted-foreground">
                  {connection.about || "No description provided."}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No connections found.</p>
        )}
      </div>
    </div>
  );
};

export default Connections;

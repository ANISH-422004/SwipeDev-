import { setRequests } from '@/app/slices/requestsSlice';
import axiosInstance from '@/lib/axiosInstance';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from 'lucide-react';

const Requests = () => {
  const requests = useSelector((state) => state.requests);
  const dispatch = useDispatch();

  const getConnectionRequests = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/connections/connections/recived`);
      dispatch(setRequests(res.data.connections));
    } catch (err) {
      console.error(err);
      toast.error("Error fetching connection requests");
    }
  };

  useEffect(() => {
    getConnectionRequests();
  }, []);


    const handelReview = async (action, requestId) => {
        // if(action === "accept"){toast.success("Connection request accepted" + requestId)}
        // else{toast.error("Connection request rejected " + requestId)}

        try {
            
            const res = await axiosInstance.post(`/api/v1/requests/review/${action}/${requestId}`);
            if (res.status === 200) {
                toast.success("Connection request " + action + "ed successfully");
                // remove that request from store
                dispatch(setRequests(requests.filter((req) => req._id !== requestId)));
                
            } else {
                toast.error("Failed to update connection request status");
            }



            
        } catch (error) {
            toast.error("Error updating connection request status");
            console.error("Error updating connection request status:", error);
        }    


    }


  (requests)

  return (
<div className="flex flex-col items-center p-6">
  <h1 className="text-2xl font-bold mb-4">Connection Requests</h1>
  <div className="flex flex-col gap-4 w-full max-w-[80%]">
    {requests && requests.length > 0 ? (
      requests.map((req) => (
        <Card key={req.senderId._id} className="px-4 py-2 ">
          <CardHeader className="flex items-center gap-4 p-2">
            <img
              src={req.senderId.profilePic}
              alt="User"
              className="w-12 h-12 rounded-full shadow ring ring-white"
            />
            <div>
              <CardTitle className="text-sm font-semibold">
                {req.senderId.firstName + " " + req.senderId.lastName}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <UserCircle2 className="w-3 h-3" />
                {req.senderId.gender || "Not specified"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground px-2 py-1">
            {req.senderId.about || "No description provided."}
          </CardContent>

          <CardFooter className="flex justify-end gap-2 px-2 py-2">
            <Button variant="outline" size="sm" onClick={() => handelReview("reject", req._id)}>
              Reject
            </Button>
            <Button size="sm" onClick={() => handelReview("accept", req._id)}>
              Accept
            </Button>
          </CardFooter>
        </Card>
      ))
    ) : (
      <p className="text-muted-foreground text-center mt-40">No connection requests found.</p>
    )}
  </div>
</div>

  );
};

export default Requests;

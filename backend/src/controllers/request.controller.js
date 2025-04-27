const { checkifConnectionRequestExists, createConnectionRequest, findRequestByIdandReciverId, updateRequestStatus } = require("../services/RequestService");
const { findUserById } = require("../services/userService");
const sendEmail = require("../utils/sendEmail");

module.exports.sendConnectionRequestController = async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const { firstName , _id: userId } = req.user;

        // Validate status
        if (!["ignored", "intrested"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Prevent sending request to self
        if (userId.toString() === toUserId) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
        }

        // Check if request already exists
        const existingRequest = await checkifConnectionRequestExists(userId, toUserId);
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        // Create new connection request
        const connectionRequest = await createConnectionRequest(userId, toUserId, status);


        //get the reciver user data to send email
        // const reciverUser  = await findUserById(toUserId);

        if (status === "intrested") {
            const Subject = "New  Dev Connection Request";
            const HTML = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #4CAF50;">New Connection Request</h1>
                    <p>Hi there,</p>
                    <p><strong>${firstName}</strong> has sent you a connection request on DevConnect!</p>
                    <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #4CAF50;">
                        <em>"Connecting developers, one request at a time."</em>
                    </p>
                    <p>Click the button below to view and respond to the request:</p>
                    <a href="https://spwipedev.xyz" 
                       style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                        View Request
                    </a>
                    <p style="margin-top: 20px;">Thank you for using DevConnect!</p>
                </div>
            `;
            const Text = `New Connection Request: ${firstName} has sent you a connection request.`;
            const sendEmailTo = "anishbhattacharya422004@gmail.com";
            const emailRes = await sendEmail.run(sendEmailTo ,  Subject , HTML , Text );
        
        
        }





        return res.status(200).json({ message: "Connection request sent successfully", connectionRequest });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports.respondToConnectionRequestController = async (req, res) => {
    try {
        const loginUserId = req.user._id; // Get the logged-in user's ID from the request object
        const { requestId, status } = req.params; // Extract ConnectionRequestId and status from the request parameters

        //validate status
        if (!["accept", "reject"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Check if the requestId is valid and belongs to the logged-in user
        const iftheRequestExists = await findRequestByIdandReciverId(requestId, loginUserId);

        if (!iftheRequestExists) {
            return res.status(400).json({ message: "Connection request not found or does not belong to you" });
        }

        // Update the status of the connection request and if not updated handeled in function

        const updatedRequest = await updateRequestStatus(requestId, status);

        //send email to the sender of the request if accepted
        if (status === "accept") {
            const Subject = "Connection Request Accepted";
            const HTML = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #4CAF50;">Connection Request Accepted</h1>
                    <p>Hi there,</p>
                    <p>Your connection request has been accepted!</p>
                    <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #4CAF50;">
                        <em>"Connecting developers, one request at a time."</em>
                    </p>
                    <p>Thank you for using DevConnect!</p>
                </div>
            `;
            const Text = `Your connection request has been accepted.`;
            const sendEmailTo = "anishbhattacharya422004@gmail.com";

            const emailRes = await sendEmail.run(sendEmailTo ,  Subject , HTML , Text );
        }


        return res.status(200).json({ message: "Connection request updated successfully", updatedRequest });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
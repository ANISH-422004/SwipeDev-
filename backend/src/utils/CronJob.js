const nodeCron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const connectionRequestModel = require('../models/connectionRequest.model');
const sendEmail = require('./sendEmail');

// 🕗 Schedule Cron Job - Every day at 8 AM
nodeCron.schedule('0 8 * * *', async () => {
    console.log("Starting daily connection request email job...");

    try {
        // 🔍 Find yesterday's date range
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        // 📩 Fetch pending connection requests created yesterday
        const pendingRequests = await connectionRequestModel.find({
            createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
            status: 'intrested',
        }).populate('senderId receiverId', 'email firstName lastName');

        if (pendingRequests.length === 0) {
            console.log("No pending connection requests from yesterday.");
            return;
        }

        // 📚 Group requests by receiver
        const requestsByReceiver = {};
        pendingRequests.forEach((request) => {
            const receiverEmail = request.receiverId.email;
            if (!requestsByReceiver[receiverEmail]) {
                requestsByReceiver[receiverEmail] = [];
            }
            requestsByReceiver[receiverEmail].push(request.senderId);
        });

        // ✉️ Send Email to each receiver
        for (const [receiverEmail, senderList] of Object.entries(requestsByReceiver)) {
            const subject = "👋 You have new connection requests!";

            // 📄 Build HTML content dynamically
            const HTMLContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #6C63FF;">👥 New Connection Requests</h2>
                    <p>Hello,</p>
                    <p>You received connection requests from the following users yesterday:</p>
                    <ul style="line-height: 1.6;">
                        ${senderList.map(sender => `<li>${sender.firstName} ${sender.lastName}</li>`).join('')}
                    </ul>
                    <p style="margin-top: 20px;">Log in to your account to respond to them! 🚀</p>
                    <a href="https://spwipedev.xyz/requests" style="display: inline-block; padding: 10px 20px; background-color: #6C63FF; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Requests</a>
                </div>
            `;

            const textContent = `
                You have new connection requests!
                Received requests from:
                ${senderList.map(sender => `${sender.firstName} ${sender.lastName} (${sender.email})`).join('\n')}
                
                Visit your dashboard to respond!
            `;

            // 🛫 Send the email
            await sendEmail.run(receiverEmail, subject, HTMLContent, textContent);
            console.log(`✅ Email sent to ${receiverEmail}`);
        }

    } catch (error) {
        console.error("❌ Error in daily connection request email job:", error);
    }
});



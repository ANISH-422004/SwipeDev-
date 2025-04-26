const { SendEmailCommand } =  require( "@aws-sdk/client-ses");
const { sesClient } =  require( "./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress,subject , HTMl , Text) => {
    return new SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: HTMl,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: Text,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};

const run = async (subject, HTMl, Text) => {
    const sendEmailCommand = createSendEmailCommand(
        "anishbhattacharya422004@gmail.com",
        "SwipeDev@spwipedev.xyz",
        subject, HTMl, Text
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            /** @type { import('@aws-sdk/client-ses').MessageRejected} */
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};


module.exports = { run };
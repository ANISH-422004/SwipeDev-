const { SESClient } = require("@aws-sdk/client-ses");
const config = require("../config/config");
// Set the AWS Region.
const REGION = "ap-south-1"; // e.g. "us-east-1"
// Create SES service object.
const sesClient = new SESClient({ region: REGION,
    credentials: {
        accessKeyId: config.AMAZONE_SES_ACCESSKEY,
        secretAccessKey: config.AMAZONE_SES_SECRETKEY,
    },
 });
module.exports =  { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
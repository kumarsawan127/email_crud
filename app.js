const mysql = require('mysql');
const express = require('express');
var app = express();
const nodemailer = require("nodemailer");

const bodyparser = require('body-parser');
app.use(bodyparser.json());
const { sendEmailKeysValidator, saveSmtpSettingsKeysValidator } = require('./util/common');


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Admin@123",
    database: "EmployeeDB"
})

mysqlConnection.connect((err) => {
    if (!err) {
        console.log("DB connection succeded");
    }
    else {
        console.log("DB connection failed", err);
    }
})
app.listen(3000, () => console.log("express server is running on port 3000"));

app.post('/sendEmail', sendEmailKeysValidator, async (req, res) => {
    try {
        const { toEmail, body, subject, smtpSettingId } = req.body;

        smtpPromise = () => {
            return new Promise((resolve, reject) => {
                mysqlConnection.query('select * from SmtpSettings where  smtpId = ?', [smtpSettingId], (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                });
            });
        };
        let smtpSetting = await smtpPromise();
        smtpSetting = smtpSetting[0];

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: smtpSetting.smtpHost,
            port: smtpSetting.smtpPort,
            secure: smtpSetting.smtpPort === 465 ? true : false, // true for 465, false for other ports
            auth: {
                user: smtpSetting.userName,
                pass: smtpSetting.password,
            },
        });
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `${smtpSetting.fromName}<${smtpSetting.fromEmail}>`, // sender address
            to: toEmail, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.send({ message: nodemailer.getTestMessageUrl(info) });
    } catch (error) {
        return res.status(500).send({ status: 500, message: error });
    }
});

app.post('/saveSmtpSettings', saveSmtpSettingsKeysValidator, async (req, res) => {
    try {
        const { fromName, fromEmail, userName, password, smtpHost, smtpPort, certificationLayer, messagePerDay, messageTimeGapInMinutes, setDifferentReply, imapHost, imapPort, imapCertificationLayer, imapUseDifferentAccount } = req.body;

        // Output the book to the console for debugging
        await mysqlConnection.query("INSERT INTO `SmtpSettings` (`fromName`, `fromEmail`, `userName`,`password`,`smtpHost`,`smtpPort`,`certificationLayer`,`messagePerDay`,`messageTimeGapInMinutes`,`setDifferentReply`) VALUES (?)", [[fromName, fromEmail, userName, password, smtpHost, smtpPort, certificationLayer, messagePerDay, messageTimeGapInMinutes, setDifferentReply]], function (err, result) {
            if (err) {
                console.log(err)
            };
            res.send({ message: "Data inserted", insertId: result.insertId });
        });
    } catch (error) {
        return res.status(500).send({ status: 500, message: JSON.stringify(error) });
    }
});


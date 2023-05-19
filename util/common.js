module.exports = {
    saveSmtpSettingsKeysValidator: (req, res, next) => {
        const { fromName, fromEmail, userName, password, smtpHost, smtpPort, certificationLayer, messagePerDay, messageTimeGapInMinutes, setDifferentReply, imapHost, imapPort, imapCertificationLayer, imapUseDifferentAccount } = req.body;

        if (!isEmailValid(fromEmail)) {
            return res.status(400).send({ status: 400, message: 'From email missing or invalid' });
        }
        if (!fromName || !fromName.trim().length || typeof fromName !== 'string') {
            return res.status(400).send({ status: 400, message: 'From name is missing or invalid' });
        }
        if (!userName || !userName.trim().length || typeof userName !== 'string') {
            return res.status(400).send({ status: 400, message: 'username is missing or invalid' });
        }
        if (!password || !password.trim().length || typeof password !== 'string') {
            return res.status(400).send({ status: 400, message: 'Password is missing or invalid' });
        }
        if (!smtpHost || !smtpHost.trim().length || !is_domain(smtpHost)) {
            return res.status(400).send({ status: 400, message: 'SMTP host is missing or invalid' });
        }
        if (!smtpPort || typeof smtpPort !== 'number') {
            return res.status(400).send({ status: 400, message: 'smtpPort is missing or invalid' });
        }
        if (!certificationLayer || !['SSL', 'TCS', 'NONE'].includes(certificationLayer)) {
            return res.status(400).send({ status: 400, message: 'certificationLayer is missing or invalid' });
        }
        if (!messagePerDay || typeof messagePerDay !== 'number') {
            return res.status(400).send({ status: 400, message: 'messagePerDay is missing or invalid' });
        }
        if (!messageTimeGapInMinutes || typeof messageTimeGapInMinutes !== 'number') {
            return res.status(400).send({ status: 400, message: 'messageTimeGapInMinutes is missing or invalid' });
        }
        if (typeof setDifferentReply !== 'boolean') {
            return res.status(400).send({ status: 400, message: 'setDifferentReply is missing or invalid' });
        }
        if (typeof imapUseDifferentAccount !== 'boolean') {
            return res.status(400).send({ status: 400, message: 'imapUseDifferentAccount is missing or invalid' });
        }
        if (!imapCertificationLayer || !['SSL', 'TCS', 'NONE'].includes(imapCertificationLayer)) {
            return res.status(400).send({ status: 400, message: 'imapCertificationLayer is missing or invalid' });
        }
        if (!imapHost || !imapHost.trim().length || !is_domain(imapHost)) {
            return res.status(400).send({ status: 400, message: 'IMAP host is missing or invalid' });
        }
        if (!imapPort || typeof imapPort !== 'number') {
            return res.status(400).send({ status: 400, message: 'imapPort is missing or invalid' });
        }

        next()
    },
    sendEmailKeysValidator: (req, res, next) => {
        const { toEmail, body, subject, smtpSettingId } = req.body;
        if (!isEmailValid(toEmail)) {
            return res.status(400).send({ status: 400, message: 'To email invalid' });
        }
        if (!body || !body.trim().length) {
            return res.status(400).send({ status: 400, message: 'Email body missing' });
        }
        if (!subject || !subject.trim().length) {
            return res.status(400).send({ status: 400, message: 'Email subject missing' });
        }
        if (!smtpSettingId || typeof smtpSettingId !== 'number') {
            return res.status(400).send({ status: 400, message: 'smtpSettingId missing or invalid' });
        }
        next()
    }
}

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    email = email.trim();
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    var valid = emailRegex.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    var domainParts = parts[1].split(".");
    if (domainParts.some(function (part) { return part.length > 63; }))
        return false;

    return true;
}
function is_domain(str) {
    regexp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;

    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}


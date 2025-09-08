import emailjs from 'emailjs-com';

/**
 * send_email.js
 * Sends an email using EmailJS (client-side).
 * You need to sign up at https://www.emailjs.com/ and get your service ID, template ID, and user ID.
 * Install emailjs-com: npm install emailjs-com
 */

// TODO Verificar como fazer esse envio de email com outra ferramenta (AWS SES?)
/**
 * Sends an email using EmailJS.
 * @param {string} toEmail - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} message - Email message body.
 * @returns {Promise} Resolves on success, rejects on failure.
 */
export function sendEmail(toEmail, subject, message) {
    const serviceID = 'your_service_id';
    const templateID = 'your_template_id';
    const userID = 'your_user_id';

    const templateParams = {
        to_email: toEmail,
        subject: subject,
        message: message,
    };

    return emailjs.send(serviceID, templateID, templateParams, userID);
}

// Example usage:
// sendEmail('recipient@example.com', 'Hello', 'This is a test email.')
//   .then(response => console.log('Email sent!', response))
//   .catch(error => console.error('Failed to send email:', error));
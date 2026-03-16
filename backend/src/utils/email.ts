import nodemailer from "nodemailer";

// Using ethereal.email for mock email testing
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER || "dianna.von@ethereal.email",
    pass: process.env.ETHEREAL_PASS || "nUBd7sF7D13G9aP3nE",
  },
});

export async function sendOrderConfirmationEmail(orderId: string, userEmail: string, totalAmount: number | string) {
  try {
    const info = await transporter.sendMail({
      from: '"Amazon Clone" <no-reply@amazon-clone.com>',
      to: userEmail,
      subject: `Order Confirmation - Order #${orderId}`,
      text: `Hello,\n\nThank you for shopping with us.\nYour order #${orderId} for ₹${totalAmount} has been placed successfully and is being processed.\n\nBest regards,\nAmazon Clone Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #232f3e; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Amazon Clone</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333;">Order Confirmation</h2>
            <p>Hello,</p>
            <p>Thank you for shopping with us. Your order <strong>#${orderId}</strong> for <strong>₹${totalAmount}</strong> has been placed successfully and is being processed.</p>
            <p>We'll send another email when your order ships.</p>
            <br/>
            <p>Best regards,<br/>Amazon Clone Team</p>
          </div>
        </div>
      `,
    });

    console.log("-----------------------------------------");
    console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}

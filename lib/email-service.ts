import sgMail from "@sendgrid/mail"

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
} else {
  console.warn("SENDGRID_API_KEY is not set. Email functionality will not work.")
}

// Email template for order confirmation
export const generateOrderConfirmationEmail = (
  customerName: string,
  orderDetails: {
    orderId: number
    productName: string
    price: number
    duration: number
    startDate: Date
    endDate: Date
  },
) => {
  const startDateFormatted = new Date(orderDetails.startDate).toLocaleDateString()
  const endDateFormatted = new Date(orderDetails.endDate).toLocaleDateString()

  return {
    subject: `Crisp TV - Order Confirmation #${orderDetails.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #f5f5f5;
              background-color: #000000;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #FACC15;
            }
            .logo {
              color: #FACC15;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 20px 0;
            }
            .order-details {
              background-color: #111111;
              border: 1px solid #333;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .order-summary {
              border-top: 1px solid #333;
              margin-top: 20px;
              padding-top: 20px;
            }
            .button {
              display: inline-block;
              background-color: #FACC15;
              color: #000000 !important;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              border-top: 1px solid #333;
              font-size: 12px;
              color: #999;
            }
            h1, h2, h3 {
              color: #FACC15;
            }
            .price {
              font-size: 24px;
              font-weight: bold;
              color: #FACC15;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #333;
            }
            th {
              color: #FACC15;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Crisp TV</div>
            </div>
            <div class="content">
              <h1>Order Confirmation</h1>
              <p>Hello ${customerName},</p>
              <p>Thank you for your order! We're excited to have you as a customer. Your subscription has been activated and is ready to use.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> #${orderDetails.orderId}</p>
                <table>
                  <tr>
                    <th>Package</th>
                    <th>Duration</th>
                    <th>Price</th>
                  </tr>
                  <tr>
                    <td>${orderDetails.productName}</td>
                    <td>${orderDetails.duration} days</td>
                    <td>$${orderDetails.price.toFixed(2)}</td>
                  </tr>
                </table>
                
                <div class="order-summary">
                  <p><strong>Subscription Period:</strong> ${startDateFormatted} to ${endDateFormatted}</p>
                  <p><strong>Total:</strong> <span class="price">$${orderDetails.price.toFixed(2)}</span></p>
                </div>
              </div>
              
              <p>You can access your subscription and manage your account by clicking the button below:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-iptv-site.com"}/dashboard" class="button">Go to Dashboard</a>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              <p>Enjoy your premium IPTV experience!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Crisp TV. All rights reserved.</p>
              <p>This email was sent to you because you made a purchase on our website.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Crisp TV - Order Confirmation #${orderDetails.orderId}
      
      Hello ${customerName},
      
      Thank you for your order! We're excited to have you as a customer. Your subscription has been activated and is ready to use.
      
      Order Details:
      Order ID: #${orderDetails.orderId}
      Package: ${orderDetails.productName}
      Duration: ${orderDetails.duration} days
      Price: $${orderDetails.price.toFixed(2)}
      
      Subscription Period: ${startDateFormatted} to ${endDateFormatted}
      Total: $${orderDetails.price.toFixed(2)}
      
      You can access your subscription and manage your account by visiting:
      ${process.env.NEXT_PUBLIC_APP_URL || "https://your-iptv-site.com"}/dashboard
      
      If you have any questions or need assistance, please don't hesitate to contact our support team.
      
      Enjoy your premium IPTV experience!
      
      © ${new Date().getFullYear()} Crisp TV. All rights reserved.
      This email was sent to you because you made a purchase on our website.
    `,
  }
}

// Email template for subscription expiration reminder
export const generateSubscriptionExpirationEmail = (
  customerName: string,
  subscriptionDetails: {
    subscriptionId: number
    productName: string
    endDate: Date
    renewalLink: string
  },
) => {
  const endDateFormatted = new Date(subscriptionDetails.endDate).toLocaleDateString()
  const daysRemaining = Math.ceil(
    (new Date(subscriptionDetails.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return {
    subject: `Crisp TV - Your Subscription is Expiring Soon`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription Expiration Notice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #f5f5f5;
              background-color: #000000;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #FACC15;
            }
            .logo {
              color: #FACC15;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 20px 0;
            }
            .subscription-details {
              background-color: #111111;
              border: 1px solid #333;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background-color: #FACC15;
              color: #000000 !important;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              border-top: 1px solid #333;
              font-size: 12px;
              color: #999;
            }
            h1, h2, h3 {
              color: #FACC15;
            }
            .expiration {
              color: #ff6b6b;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Crisp TV</div>
            </div>
            <div class="content">
              <h1>Subscription Expiration Notice</h1>
              <p>Hello ${customerName},</p>
              <p>This is a friendly reminder that your Crisp TV subscription is expiring soon.</p>
              
              <div class="subscription-details">
                <h2>Subscription Details</h2>
                <p><strong>Package:</strong> ${subscriptionDetails.productName}</p>
                <p><strong>Expiration Date:</strong> <span class="expiration">${endDateFormatted} (${daysRemaining} days remaining)</span></p>
              </div>
              
              <p>To ensure uninterrupted service, please renew your subscription before the expiration date.</p>
              <a href="${subscriptionDetails.renewalLink}" class="button">Renew Now</a>
              
              <p>If you have any questions or need assistance with the renewal process, our support team is here to help.</p>
              <p>Thank you for choosing Crisp TV!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Crisp TV. All rights reserved.</p>
              <p>This email was sent to you because you have an active subscription with us.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Crisp TV - Your Subscription is Expiring Soon
      
      Hello ${customerName},
      
      This is a friendly reminder that your Crisp TV subscription is expiring soon.
      
      Subscription Details:
      Package: ${subscriptionDetails.productName}
      Expiration Date: ${endDateFormatted} (${daysRemaining} days remaining)
      
      To ensure uninterrupted service, please renew your subscription before the expiration date.
      
      Renew now: ${subscriptionDetails.renewalLink}
      
      If you have any questions or need assistance with the renewal process, our support team is here to help.
      
      Thank you for choosing Crisp TV!
      
      © ${new Date().getFullYear()} Crisp TV. All rights reserved.
      This email was sent to you because you have an active subscription with us.
    `,
  }
}

// Email template for welcome email
export const generateWelcomeEmail = (customerName: string) => {
  return {
    subject: `Welcome to Crisp TV!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Crisp TV</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #f5f5f5;
              background-color: #000000;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #FACC15;
            }
            .logo {
              color: #FACC15;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 20px 0;
            }
            .feature-box {
              background-color: #111111;
              border: 1px solid #333;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background-color: #FACC15;
              color: #000000 !important;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              border-top: 1px solid #333;
              font-size: 12px;
              color: #999;
            }
            h1, h2, h3 {
              color: #FACC15;
            }
            .feature-list {
              list-style-type: none;
              padding: 0;
            }
            .feature-list li {
              padding: 5px 0;
              padding-left: 25px;
              position: relative;
            }
            .feature-list li:before {
              content: "✓";
              color: #FACC15;
              position: absolute;
              left: 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Crisp TV</div>
            </div>
            <div class="content">
              <h1>Welcome to Crisp TV!</h1>
              <p>Hello ${customerName},</p>
              <p>Thank you for creating an account with Crisp TV! We're thrilled to have you join our community of premium IPTV viewers.</p>
              
              <div class="feature-box">
                <h2>What You Can Enjoy with Crisp TV:</h2>
                <ul class="feature-list">
                  <li>Thousands of channels from around the world</li>
                  <li>HD, FHD, and 4K quality streaming</li>
                  <li>Movies and TV shows on demand</li>
                  <li>Sports, news, entertainment, and more</li>
                  <li>Multi-device support</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
              
              <p>To start enjoying our premium IPTV service, browse our packages and subscribe today:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-iptv-site.com"}/packages" class="button">View Packages</a>
              
              <p>If you have any questions or need assistance, our support team is always ready to help.</p>
              <p>We hope you enjoy your Crisp TV experience!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Crisp TV. All rights reserved.</p>
              <p>This email was sent to you because you created an account on our website.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Crisp TV!
      
      Hello ${customerName},
      
      Thank you for creating an account with Crisp TV! We're thrilled to have you join our community of premium IPTV viewers.
      
      What You Can Enjoy with Crisp TV:
      - Thousands of channels from around the world
      - HD, FHD, and 4K quality streaming
      - Movies and TV shows on demand
      - Sports, news, entertainment, and more
      - Multi-device support
      - 24/7 customer support
      
      To start enjoying our premium IPTV service, browse our packages and subscribe today:
      ${process.env.NEXT_PUBLIC_APP_URL || "https://your-iptv-site.com"}/packages
      
      If you have any questions or need assistance, our support team is always ready to help.
      
      We hope you enjoy your Crisp TV experience!
      
      © ${new Date().getFullYear()} Crisp TV. All rights reserved.
      This email was sent to you because you created an account on our website.
    `,
  }
}

// Function to send email
export const sendEmail = async (
  to: string,
  templateData: {
    subject: string
    html: string
    text: string
  },
) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY is not set. Email not sent.")
    return { success: false, message: "Email service not configured" }
  }

  const msg = {
    to,
    from: process.env.EMAIL_FROM || "noreply@crisptv.com",
    subject: templateData.subject,
    text: templateData.text,
    html: templateData.html,
  }

  try {
    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: error.message || "Failed to send email",
      error,
    }
  }
}


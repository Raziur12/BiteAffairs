# EmailJS Setup Guide for Bite Affairs

## 🎯 Overview
EmailJS allows sending emails directly from your React app to `ragacar608@bitfami.com` without a backend server.

## 📋 Step-by-Step Setup

### 1. Create EmailJS Account
- Visit: https://www.emailjs.com/
- Click "Sign Up" (Free account)
- Verify your email
- Login to dashboard

### 2. Add Email Service
1. Dashboard → "Email Services" → "Add New Service"
2. Choose "Gmail" (recommended)
3. Connect your Gmail account (ragacar608@gmail.com or similar)
4. **Copy the Service ID** (looks like: `service_abc123`)

### 3. Create Email Template
1. Dashboard → "Email Templates" → "Create New Template"
2. Template Name: `Order Notification`
3. Use this template:

```
Subject: New Order - {{order_id}}

Hello Admin,

New order received:

Order ID: {{order_id}}
Customer: {{customer_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}
Total: ₹{{total_amount}}
Items: {{total_items}}
Date: {{order_date}}

Details:
{{order_details}}

Please review this order.

Bite Affairs System
```

4. **Copy the Template ID** (looks like: `template_xyz789`)

### 4. Get Public Key
1. Dashboard → "Account" → "General"
2. **Copy your Public Key** (looks like: `user_abcdef123456`)

### 5. Update Code
In `src/services/emailService.js`, replace:

```javascript
this.emailJSServiceID = 'service_YOUR_ID_HERE'; // Paste your Service ID
this.emailJSTemplateID = 'template_YOUR_ID_HERE'; // Paste your Template ID  
this.emailJSPublicKey = 'YOUR_PUBLIC_KEY_HERE'; // Paste your Public Key
```

### 6. Enable EmailJS
In `src/services/emailService.js`, line 37, uncomment:
```javascript
return await this.sendViaEmailJS(orderData);
```

And comment out:
```javascript
// this.openEmailClient(orderData);
```

## 🎉 Testing
1. Place a test order
2. Check your email at `ragacar608@bitfami.com`
3. You should receive the order notification automatically!

## 💰 Pricing
- **Free Tier**: 200 emails/month
- **Paid Plans**: Start at $15/month for 1000 emails

## 🔧 Alternative: Current Setup
If you don't want to setup EmailJS right now, the current system:
1. Opens your email client (Gmail, Outlook, etc.)
2. Pre-fills the email with order details
3. You manually click "Send"

This works immediately without any setup!

## 📞 Support
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/

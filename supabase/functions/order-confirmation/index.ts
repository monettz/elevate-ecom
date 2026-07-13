import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
// IMPORTANT: Change this to your actual admin email!
const ADMIN_EMAIL = 'admin@yourstore.com'; 

serve(async (req) => {
  try {
    const payload = await req.json();

    // Only process INSERTS on the orders table
    if (payload.type !== 'INSERT' || !payload.record) {
      return new Response('Not an insert event', { status: 200 });
    }

    const order = payload.record;
    
    // Skip if there's no email provided
    if (!order.customer_email || order.customer_email === 'guest@example.com') {
      return new Response('No valid customer email', { status: 200 });
    }

    // 1. Send email to Customer
    const customerEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // IMPORTANT: The 'from' email MUST be verified in your Resend dashboard
        from: 'Elevate Store <orders@elevatestore.com>', 
        to: [order.customer_email],
        subject: `Order Confirmation - ${order.id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="color: #2563eb;">Thank you for your order!</h1>
            <p>Hi ${order.customer_name},</p>
            <p>We have successfully received your order <strong>${order.id}</strong> and are currently processing it.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Summary</h3>
              <p><strong>Total Paid:</strong> TZS ${order.total.toLocaleString()}</p>
              <p><strong>Shipping to:</strong> ${order.address}</p>
            </div>
            
            <p>We will notify you again as soon as your items ship.</p>
            <p>Thank you for shopping with Elevate Store!</p>
          </div>
        `,
      }),
    });

    // 2. Send email to Admin
    const adminEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Elevate Alerts <alerts@elevatestore.com>',
        to: [ADMIN_EMAIL],
        subject: `🚨 New Order Received - ${order.id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="color: #ef4444;">🚨 New Order Alert</h1>
            <p>A new order has just been placed on your store!</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
              <p><strong>Total:</strong> TZS ${order.total.toLocaleString()}</p>
            </div>
            
            <p>Please log in to your Admin Panel to view and process this order.</p>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

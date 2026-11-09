// Supabase Edge Function: send-booking-email
// Triggered via Supabase Database Webhook (on INSERT into public.bookings)
// or invoked directly via supabase.functions.invoke('send-booking-email')
//
// Required Supabase Secrets:
//   supabase secrets set RESEND_API_KEY=re_xxxxxxxxx
//   supabase secrets set INSTRUCTOR_EMAIL=info@klaverdrive.nl
//   supabase secrets set FROM_EMAIL="Rijschool KlaverDrive <proefles@klaverdrive.nl>"

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const INSTRUCTOR_EMAIL = Deno.env.get("INSTRUCTOR_EMAIL") || "info@klaverdrive.nl";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Rijschool KlaverDrive <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRecord {
  id?: string;
  name: string;
  email: string;
  phone: string;
  preferred_datetime: string;
  transmission?: string;
  message?: string;
  created_at?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable in Edge Function secrets.");
    }

    const payload = await req.json();

    // Supports both Database Webhook format ({ type: 'INSERT', record: { ... } })
    // and direct invocation format ({ name, email, phone, ... })
    const booking: BookingRecord = payload.record || payload;

    if (!booking || !booking.email || !booking.name) {
      return new Response(
        JSON.stringify({ error: "Invalid booking payload: name and email are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const transmissionLabel =
      booking.transmission === "automaat" ? "Automaat" : "Handgeschakeld (Schakel)";

    // 1. Send confirmation email to the student
    const studentEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [booking.email],
        subject: "Bevestiging van je proefles aanvraag – Rijschool KlaverDrive",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 580px; margin: 0 auto; line-height: 1.6;">
            <div style="background-color: #064e3b; color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 20px;">Rijschool KlaverDrive</h1>
              <p style="margin: 4px 0 0; font-size: 14px; color: #d1fae5;">Bedankt voor je proefles aanvraag!</p>
            </div>
            <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
              <p>Beste <strong>${escapeHtml(booking.name)}</strong>,</p>
              <p>We hebben je aanvraag voor een vrijblijvende proefles in goede orde ontvangen. Ik neem binnen 24 uur telefonisch of via WhatsApp contact met je op om de definitieve datum en het ophaaladres met je af te stemmen.</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
                <h3 style="margin: 0 0 12px; font-size: 15px; color: #0f172a;">Jouw opgegeven gegevens:</h3>
                <p style="margin: 4px 0;"><strong>Naam:</strong> ${escapeHtml(booking.name)}</p>
                <p style="margin: 4px 0;"><strong>Telefoonnummer:</strong> ${escapeHtml(booking.phone)}</p>
                <p style="margin: 4px 0;"><strong>Voorkeur datum/tijd:</strong> ${escapeHtml(booking.preferred_datetime)}</p>
                <p style="margin: 4px 0;"><strong>Transmissie:</strong> ${escapeHtml(transmissionLabel)}</p>
                ${
                  booking.message
                    ? `<p style="margin: 8px 0 0;"><strong>Opmerking:</strong><br/>${escapeHtml(booking.message)}</p>`
                    : ""
                }
              </div>

              <p>Heb je in de tussentijd alvast een vraag? Je kunt altijd bellen of WhatsAppen naar <strong>06 - 84 27 66 49</strong>.</p>
              <p style="margin-top: 24px;">Met vriendelijke groet,<br/><strong>Rijschool KlaverDrive</strong></p>
            </div>
          </div>
        `,
      }),
    });

    // 2. Send notification email to the driving instructor
    const instructorEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [INSTRUCTOR_EMAIL],
        reply_to: booking.email,
        subject: `Nieuwe Proefles Aanvraag: ${booking.name} (${booking.preferred_datetime})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 580px; margin: 0 auto; line-height: 1.6;">
            <h2 style="color: #064e3b; margin-bottom: 8px;">Nieuwe Proefles Aanvraag</h2>
            <p style="margin-top: 0; color: #475569;">Er is zojuist een nieuwe proefles aangevraagd via de website.</p>
            <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; width: 160px;">Naam</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(booking.name)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Telefoon</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(booking.phone)}">${escapeHtml(booking.phone)}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">E-mailadres</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Voorkeur moment</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(booking.preferred_datetime)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Transmissie</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(transmissionLabel)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 600;">Bericht / Opmerking</td>
                <td style="padding: 10px 14px;">${escapeHtml(booking.message || "Geen opmerking")}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; font-size: 14px; color: #64748b;">
              Open het <a href="https://klaverdrive.nl/#/admin">Admin Dashboard</a> om deze aanvraag goed te keuren of af te wijzen.
            </p>
          </div>
        `,
      }),
    });

    const [studentRes, instructorRes] = await Promise.all([
      studentEmailPromise,
      instructorEmailPromise,
    ]);

    const studentData = await studentRes.json();
    const instructorData = await instructorRes.json();

    if (!studentRes.ok || !instructorRes.ok) {
      console.error("Resend API error:", { studentData, instructorData });
      return new Response(
        JSON.stringify({
          error: "Failed to send one or more emails via Resend",
          details: { studentData, instructorData },
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        studentEmailId: studentData.id,
        instructorEmailId: instructorData.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


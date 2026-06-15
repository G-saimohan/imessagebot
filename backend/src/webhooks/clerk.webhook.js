import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_KEY;

    if (!signingSecret) {
      return res.status(500).json({
        message: "CLERK_WEBHOOK_SIGNING_KEY is missing",
      });
    }

    const payload =
      typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);

    const request = new Request("http://localhost/webhook", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });

    const evt = await verifyWebhook(request, {
      signingSecret,
    });

    console.log("Webhook Event:", evt.type);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find(
          (e) => e.id === u.primary_email_address_id
        )?.email_address ||
        u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name]
          .filter(Boolean)
          .join(" ") ||
        u.username ||
        email?.split("@")[0];

      await User.findOneAndUpdate(
        { clerkId: u.id },
        {
          clerkId: u.id,
          email,
          fullName,
          profilePic: u.image_url,
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log("User saved:", email);
    }

    if (evt.type === "user.deleted") {
      if (evt.data.id) {
        await User.findOneAndDelete({
          clerkId: evt.data.id,
        });
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Clerk Webhook Error:", error);

    return res.status(400).json({
      message: "Webhook verification failed",
    });
  }
});

export default router;
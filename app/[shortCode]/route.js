import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Link from "@/models/Link";

export async function GET(request) {
  try {
    // Get shortCode from the URL path
    const shortCode = request.url.split('/').pop();

    await connectDB();

    const link = await Link.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!link) {
      return new Response("Link not found", { status: 404 });
    }

    return NextResponse.redirect(link.originalUrl, { status: 307 });
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

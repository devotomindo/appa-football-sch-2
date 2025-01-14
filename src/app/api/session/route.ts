import { setSchoolSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const school = await request.json();
    await setSchoolSession(school);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update school session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update session" },
      { status: 500 },
    );
  }
}

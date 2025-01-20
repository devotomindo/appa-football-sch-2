import { cookies } from "next/headers";

export type SchoolSession = {
  id: number;
  name: string;
  role: string;
  imageUrl?: string;
};

export async function getSchoolSession(): Promise<SchoolSession | null> {
  const cookieStore = await cookies();
  const schoolSession = cookieStore.get("selected-school");

  if (!schoolSession?.value) {
    return null;
  }

  try {
    return JSON.parse(schoolSession.value);
  } catch {
    // If parsing fails, clean up the invalid cookie
    cookieStore.delete("selected-school");
    return null;
  }
}

export async function setSchoolSession(
  school: SchoolSession | null,
): Promise<void> {
  const cookieStore = await cookies();

  // Always clean up the existing cookie first
  cookieStore.delete("selected-school");

  if (!school) {
    return;
  }

  // Only store the minimal required data
  const minimalSchoolData = {
    id: school.id,
    name: school.name,
    role: school.role,
  };

  cookieStore.set("selected-school", JSON.stringify(minimalSchoolData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

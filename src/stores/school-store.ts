import type { SchoolSession } from "@/lib/session";
import { create } from "zustand";

type School = {
  id: number;
  name: string;
  role: string;
};

type SchoolStore = {
  selectedSchool: SchoolSession | null;
  setSelectedSchool: (school: SchoolSession | null) => Promise<void>;
  hydrate: (school: SchoolSession | null) => void;
};

export const useSchoolStore = create<SchoolStore>((set) => ({
  selectedSchool: null,
  hydrate: (school) => set({ selectedSchool: school }),
  setSelectedSchool: async (school) => {
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify(school),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update session");
      }

      set({ selectedSchool: school });
    } catch (error) {
      console.error("Failed to update school:", error);
      throw error;
    }
  },
}));

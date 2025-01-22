import type { SchoolSession } from "@/lib/session";
import { create } from "zustand";

type School = {
  id: string;
  name: string;
  role: string;
};

type SchoolStore = {
  selectedSchool: SchoolSession | null;
  isHydrating: boolean;
  setSelectedSchool: (school: SchoolSession | null) => Promise<void>;
  hydrate: (school: SchoolSession | null) => void;
};

export const useSchoolStore = create<SchoolStore>((set) => ({
  selectedSchool: null,
  isHydrating: true,
  hydrate: (school) => set({ selectedSchool: school, isHydrating: false }),
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

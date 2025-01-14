import { create } from "zustand";

type School = {
  id: number;
  name: string;
  role: string;
};

type SchoolStore = {
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => Promise<void>;
};

export const useSchoolStore = create<SchoolStore>((set) => ({
  selectedSchool: null,
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

      // Only update local state if server update was successful
      set({ selectedSchool: school });
    } catch (error) {
      console.error("Failed to update school:", error);
      throw error;
    }
  },
}));

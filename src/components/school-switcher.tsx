"use client";

import { useSchoolStore } from "@/stores/school-store";
import { Menu } from "@mantine/core";
import { IconBuilding } from "@tabler/icons-react";

type School = {
  id: string;
  name: string;
  role: string;
};

export function SchoolSwitcher({ schools }: { schools: School[] }) {
  const { selectedSchool, setSelectedSchool } = useSchoolStore();

  return (
    <Menu>
      <Menu.Target>
        <button className="flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
          <IconBuilding size={16} />
          <span>{selectedSchool?.name ?? "Select School"}</span>
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        {schools.map((school) => (
          <Menu.Item
            key={school.id}
            disabled={school.id === selectedSchool?.id}
            onClick={() => setSelectedSchool(school)}
          >
            <div className="flex items-center gap-2">
              <p>{school.name}</p>
              <p className="text-gray-500">{school.role}</p>
            </div>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

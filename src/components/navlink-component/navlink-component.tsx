import { NavLink } from "@mantine/core";
import Link from "next/link";

export const navLinkStyles = {
  body: {
    paddingInline: ".5rem",
  },
};

export function NavLinkComponent({
  label,
  path,
  toggle,
  leftSection,
  pathname,
}: {
  label: string;
  path: string;
  toggle: () => void;
  leftSection?: React.ReactNode;
  pathname: string;
}) {
  return (
    <NavLink
      label={label}
      onClick={toggle}
      component={Link}
      href={`/dashboard${path}` as string}
      active={pathname == `/dashboard${path}`}
      color={pathname == `/dashboard${path}` ? "#E92222" : ""}
      variant="filled"
      className="hover:!bg-[#E92222] hover:text-white"
      leftSection={leftSection}
    />
  );
}

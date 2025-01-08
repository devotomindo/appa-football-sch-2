"use client";

import { Tabs } from "@mantine/core";
import { IconClipboard } from "@tabler/icons-react";
import Link from "next/link";
import { AssesmenPemainTable } from "../table/assesmen-pemain-table";

function TabsPanel({
  name,
  category,
  value,
}: {
  name: string;
  category: string;
  value: string;
}) {
  return (
    <Tabs.Panel
      value={value}
      className="flex w-full items-center justify-between border-b-[1px] border-black px-4 pb-2"
    >
      <div className="flex items-center gap-2 uppercase">
        <IconClipboard />
        {name} - {category}
      </div>
      <Link
        href={`/dashboard/asesmen-pemain/asesmen/${name.toLowerCase().split(" ").join("-")}`}
        className="rounded-xl bg-green-600 px-8 py-2 uppercase text-white"
      >
        lakukan asesmen
      </Link>
    </Tabs.Panel>
  );
}

export function AsesmenPemainView() {
  return (
    <div className="mt-10 space-y-4">
      <p className="font-bold uppercase">daftar asesmen</p>
      <Tabs
        defaultValue="semuaKategori"
        color="dark"
        variant="pills"
        radius="md"
      >
        <Tabs.List className="space-x-4">
          <Tabs.Tab value="semuaKategori" className="uppercase">
            semua kategori
          </Tabs.Tab>
          <Tabs.Tab value="fisik" className="uppercase">
            fisik
          </Tabs.Tab>
          <Tabs.Tab value="kecepatan" className="uppercase">
            kecepatan
          </Tabs.Tab>
          <Tabs.Tab value="kelincahan" className="uppercase">
            kelincahan
          </Tabs.Tab>
          <Tabs.Tab value="teknik" className="uppercase">
            teknik
          </Tabs.Tab>
        </Tabs.List>

        <div className="mt-14 space-y-6">
          <TabsPanel
            name="push up 1 menit"
            category="fisik"
            value="semuaKategori"
          />
          <TabsPanel
            name="sprint 100 meter"
            category="kecepatan"
            value="semuaKategori"
          />
          <TabsPanel
            name="shuttle run"
            category="kelincahan"
            value="semuaKategori"
          />
          <TabsPanel
            name="short pass"
            category="teknik"
            value="semuaKategori"
          />
          <TabsPanel name="long pass" category="teknik" value="semuaKategori" />
          <TabsPanel
            name="sprint 50 meter"
            category="kecepatan"
            value="semuaKategori"
          />
          <TabsPanel
            name="lari rintangan"
            category="kelincahan"
            value="semuaKategori"
          />
          <TabsPanel
            name="placing shoot (pk area)"
            category="teknik"
            value="semuaKategori"
          />
          <TabsPanel name="plank" category="fisik" value="semuaKategori" />
        </div>
      </Tabs>
      <AssesmenPemainTable />
    </div>
  );
}

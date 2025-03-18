"use client";

import { getMembersByRegionQueryOptions } from "@/features-data/members/actions/get-members-by-region/query-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

// Remove the Tippy import and use a simple tooltip
// import Tippy from "@tippyjs/react";
// import "tippy.js/dist/tippy.css";

// Using the interface from the server action
// import type { getMembersByRegion } from "@/features-data/members/actions/get-members-by-region";
// type MemberData = Awaited<ReturnType<typeof getMembersByRegion>>[0];

export function IndonesiaMap() {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [zoom, setZoom] = useState(1);
  // Add state for map center and responsive adjustments
  const [mapCenter, setMapCenter] = useState<[number, number]>([118, -2.5]);
  const [mapScale, setMapScale] = useState(900);

  const { data: membersByRegion, isLoading } = useQuery(
    getMembersByRegionQueryOptions(),
  );

  // Adjust map scale and center based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMapScale(600); // Lower scale for mobile
        setMapCenter([118, -2.5]); // Center point for Indonesia on smaller screens
      } else if (window.innerWidth < 1024) {
        setMapScale(800); // Medium scale for tablets
        setMapCenter([118, -10.5]);
      } else {
        setMapScale(900); // Default scale for larger screens
        setMapCenter([118, -10.5]);
      }
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add zoom control functions
  const handleZoomIn = () => {
    if (zoom < 8) setZoom(zoom + 0.5);
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom - 0.5);
  };

  // Handle mouse movement for custom tooltip
  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p>Loading map data...</p>
        </div>
      </div>
    );
  }

  // Function to get color based on member count
  const getRegionColor = (regionName: string) => {
    if (!membersByRegion) return "#CCCCCC"; // Default gray

    const regionData = membersByRegion.find(
      (region) => region.regionName.toLowerCase() === regionName.toLowerCase(),
    );

    if (!regionData) return "#CCCCCC"; // No data

    // Color scale based on member count
    if (regionData.memberCount > 100) return "#1a9641"; // High - green
    if (regionData.memberCount > 50) return "#a6d96a"; // Medium-high - light green
    if (regionData.memberCount > 20) return "#ffffbf"; // Medium - yellow
    if (regionData.memberCount > 5) return "#fdae61"; // Medium-low - orange
    return "#d7191c"; // Low - red
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md md:p-6">
      <div
        className="relative mx-auto flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border bg-sky-100 shadow-sm sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[2/1]"
        onMouseMove={handleMouseMove}
      >
        <div className="h-full w-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: mapScale,
              center: mapCenter, // Use dynamic center
            }}
          >
            <ZoomableGroup zoom={zoom} center={mapCenter}>
              <Geographies geography={"/gadm41_IDN_1.json"}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const regionName =
                      geo.properties.NAME_1 || geo.properties.name;
                    const regionData = membersByRegion?.find((region) => {
                      return (
                        region.regionName.toLowerCase() ===
                        regionName?.toLowerCase()
                      );
                    });
                    const memberCount = regionData?.memberCount || 0;

                    return (
                      <Geography
                        key={geo.rsmKey || geo.id || Math.random()}
                        geography={geo}
                        onMouseEnter={() => {
                          setTooltipContent(`
                            <strong>${regionName}</strong><br/>
                            Jumlah Anggota: ${memberCount || 0}<br/>
                            Jumlah Kepala Pelatih: ${regionData?.headCoachCount || 0}<br/>
                            Jumlah Pelatih: ${regionData?.coachCount || 0}<br/>
                            Jumlah Atlet: ${regionData?.athleteCount || 0}<br/>
                          `);
                          setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                          setShowTooltip(false);
                        }}
                        style={{
                          default: {
                            fill: getRegionColor(regionName),
                            stroke: "#FFFFFF",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: "#546BFB",
                            stroke: "#FFFFFF",
                            strokeWidth: 1,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#2E3B87",
                            stroke: "#FFFFFF",
                            strokeWidth: 1,
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Zoom controls - make more mobile friendly */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 md:gap-2">
          <button
            onClick={handleZoomIn}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-lg font-bold shadow-md hover:bg-gray-100 md:h-8 md:w-8 md:text-xl"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-lg font-bold shadow-md hover:bg-gray-100 md:h-8 md:w-8 md:text-xl"
            aria-label="Zoom out"
          >
            -
          </button>
        </div>

        {/* Custom tooltip */}
        {showTooltip && (
          <div
            className="fixed z-50 rounded bg-white p-2 shadow-md"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y + 10,
            }}
            dangerouslySetInnerHTML={{ __html: tooltipContent }}
          />
        )}

        {/* Legend - make it responsive */}
        <div className="absolute bottom-1 right-1 rounded bg-white p-1 shadow-md md:bottom-2 md:right-2 md:p-2">
          <div className="text-2xs font-semibold md:text-xs">
            Jumlah Anggota
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 md:h-3 md:w-3"
              style={{ backgroundColor: "#d7191c" }}
            ></div>
            <span className="text-2xs md:text-xs">{"<"} 5</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 md:h-3 md:w-3"
              style={{ backgroundColor: "#fdae61" }}
            ></div>
            <span className="text-2xs md:text-xs">5-20</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 md:h-3 md:w-3"
              style={{ backgroundColor: "#ffffbf" }}
            ></div>
            <span className="text-2xs md:text-xs">21-50</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 md:h-3 md:w-3"
              style={{ backgroundColor: "#a6d96a" }}
            ></div>
            <span className="text-2xs md:text-xs">51-100</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 md:h-3 md:w-3"
              style={{ backgroundColor: "#1a9641" }}
            ></div>
            <span className="text-2xs md:text-xs">{">"} 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

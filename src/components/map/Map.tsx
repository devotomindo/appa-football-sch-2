import { ComposableMap, Geographies, Geography } from "react-simple-maps";

export default function MapChart() {
  return (
    <ComposableMap>
      <Geographies geography={"/gadm41_IDN_1.json"}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

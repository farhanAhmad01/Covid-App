import React, { useState, useEffect } from "react";
import MapGL, { Popup } from "react-map-gl";
import numeral from "numeral";
import { Marker, NavigationControl } from "react-map-gl";
import "./Map.css";
// eslint-disable-next-line 
MapGL.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
const MAPBOX_TOKEN =
  "map box token"; // Set your mapbox token here
const Map = ({ casesType, latitude, longitude, zoom, countries, country }) => {
  // console.log(countries);
  // console.log(latitude, longitude);
  const [showPopup, togglePopup] = useState(true);
  const InitialState = {
    latitude: latitude,
    longitude: longitude,
    center: [latitude, longitude],
    zoom: zoom,
    bearing: 0,
    pitch: 0,
  };
  const [viewport, setViewport] = useState(InitialState);
  useEffect(() => {
    setViewport({
      latitude: latitude,
      longitude: longitude,
      center: [latitude, longitude],
      zoom: zoom,
      bearing: 0,
      pitch: 0,
    });
    //cleanup function:
    return () => {
      setViewport({});
    };
  }, [latitude, longitude, zoom]);
  const casesTypeColors = {
    cases: {
      rgba: "rgba(5, 155, 247, 0.5)",
      color: "rgba(5, 155, 247)",
    },
    recovered: {
      rgba: "rgba(53,211,156,0.5)",
      color: "rgba(53,211,156)",
    },
    deaths: {
      rgba: "rgba(233,30,99,0.5)",
      color: "rgba(233,30,99)",
    },
  };

  //show circle on the 🗺️
  const ShowInfo = (data, casesType = "cases") =>
    data.map((country, index) => (
      <Marker
        key={index}
        longitude={country.countryInfo.long}
        latitude={country.countryInfo.lat}
      >
        <div
          className="map-marker"
          style={{
            backgroundColor: `${casesTypeColors[casesType].rgba}`,
            border: `2px solid ${casesTypeColors[casesType].color}`,
            height: `${country[casesType] % 100}px`,
            width: `${country[casesType] % 100}px`,
          }}
        />
      </Marker>
    ));
  return (
    <div className="map">
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v10"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {ShowInfo(countries, casesType)}
        <div className="map-nav">
          <NavigationControl onViewportChange={setViewport} />
        </div>
        {showPopup && (
          <Popup
            latitude={latitude}
            longitude={longitude}
            closeButton={false}
            closeOnClick={false}
            tipSize={12}
            onClose={() => togglePopup(false)}
            anchor="bottom"
          >
            <div className="infoContainer">
              <img className="flag" src={country.flag} alt="flag" />
              <ul style={{ listStyle: "none" }}>
                <li className="name">{country.name}</li>
                <li className="list">
                  Cases: {numeral(country.cases).format("0,0")}
                </li>
                <li className="list">
                  Recovered: {numeral(country.recovered).format("0,0")}
                </li>
                <li className="list">
                  Deaths: {numeral(country.deaths).format("0,0")}
                </li>
              </ul>
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
};
export default Map;

import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  Card,
  CardContent,
  MenuItem,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData } from "./util";
import "mapbox-gl/dist/mapbox-gl.css";
import { prettyStat } from "./util";
import "./App.css";
const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [latitude, setLatitude] = useState(30.3753);
  const [longitude, setLongitude] = useState(69.3451);
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");
  const [mapCountries, setMapCountries] = useState([]);
  const [popupInfo, setPopupInfo] = useState({
    cases: 944065,
    recovered: 882332,
    deaths: 21828,
    flag: "https://disease.sh/assets/img/flags/pk.png",
    name: "Pakistan",
  });
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountries = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await response.json();
      // console.log(data);
      const countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso3,
      }));
      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
      setMapCountries(data);
    };
    getCountries();
  }, []);
  // console.log(countries);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    const response = await fetch(url);
    const data = await response.json();
    setCountryInfo(data);
    setLongitude(data.countryInfo.long);
    setLatitude(data.countryInfo.lat);
    setMapZoom(4);
    setPopupInfo({
      cases: data.cases,
      recovered: data.recovered,
      deaths: data.deaths,
      flag: data.countryInfo.flag,
      name: data.country,
    });
  };
  // console.log(countryInfo);
  return (
    <div className="app">
      {/* to header panel */}
      <div className="app__left">
        {/* header */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">{country}</MenuItem>
              {/* map through the countries and  show in dropdown */}
              {countries.map((country, index) => (
                <MenuItem value={country.name} key={index}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
          {/* InfoBoxes */}
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            active={casesType === "cases"}
            isBlue
            total={prettyStat(countryInfo.cases)}
            cases={prettyStat(countryInfo.todayCases)}
          ></InfoBox>
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            total={prettyStat(countryInfo.recovered)}
            cases={prettyStat(countryInfo.todayRecovered)}
            title="Recovered"
          ></InfoBox>
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            active={casesType === "deaths"}
            isRed
            total={prettyStat(countryInfo.deaths)}
            cases={prettyStat(countryInfo.todayDeaths)}
          ></InfoBox>
        </div>
      </div>
      {/* map */}
      <Map
        casesType={casesType}
        countries={mapCountries}
        latitude={latitude}
        longitude={longitude}
        zoom={mapZoom}
        country={popupInfo}
      />

       {/* graph */}
      <Card className="app__right">
        <CardContent>
          <h2 className="title">World wide COVID-19 New {casesType}</h2>
          <LineGraph casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
      {/* Table */}
      <Card className="app__right">
        <CardContent>
          <h3 className="title">Live Cases by Country</h3>
          <Table countries={tableData}></Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;

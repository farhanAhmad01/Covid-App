import React from "react";
import numeral from "numeral";
import "./Table.css";
const Table = ({ countries }) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Cases</th>
            <th scope="col">Recovered</th>
            <th scope="col">Deaths</th>
          </tr>
        </thead>
        <tbody>
          {countries.map(({ country, cases, deaths, recovered }, index) => (
            <tr key={index}>
              <td data-label="country">{country}</td>
              <td data-label="cases">
                {" "}
                <strong>{numeral(cases).format("0,0")}</strong>
              </td>
              <td data-label="recovered">
                {" "}
                <strong>{numeral(recovered).format("0,0")}</strong>
              </td>
              <td data-label="deaths">
                {" "}
                <strong>{numeral(deaths).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

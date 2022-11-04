import React from "react";
import ReactDOM from "react-dom/client";
import { WeaveDBWrite, WeaveDBGet } from "./weave-db";

const SUB_APPS = [
  {
    name: "WeaveDB Write",
    component: <WeaveDBWrite />,
  },
  {
    name: "WeaveDB Get",
    component: <WeaveDBGet />,
  },
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "32px",
        maxWidth: "500px",
      }}
    >
      {SUB_APPS.map((sub) => (
        <div>
          <h2>{sub.name}</h2>
          {sub.component}
        </div>
      ))}
    </div>
  </React.StrictMode>
);

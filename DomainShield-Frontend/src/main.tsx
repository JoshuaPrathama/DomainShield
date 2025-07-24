import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import DisableDevtool from "disable-devtool";


if (import.meta.env.PROD) {
  DisableDevtool({
    clearLog: true,
  });
}
console.log("ALL ENV", import.meta.env)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

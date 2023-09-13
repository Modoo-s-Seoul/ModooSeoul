import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./font/Font.css";
import PM from "./components/PM.tsx";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RecoilRoot>
    <BrowserRouter>
      <App />
      {window.location.pathname !== "/game" && <PM />}
    </BrowserRouter>
  </RecoilRoot>
  // </React.StrictMode>,
);

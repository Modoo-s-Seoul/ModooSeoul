import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./font/Font.css";
import PM from "./components/Dev/PM.tsx";
import { RecoilRoot } from "recoil";
import SocketManager from "./pages/SocketManager";
import { CursorifyProvider } from "@cursorify/react";
import { EmojiCursor } from "./components/Base/EmojiCursor.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RecoilRoot>
    <SocketManager>
      <CursorifyProvider cursor={<EmojiCursor />} delay={1} opacity={1}>
        <BrowserRouter>
          <App />
          {window.location.pathname !== "/game" && <PM />}
        </BrowserRouter>
      </CursorifyProvider>
    </SocketManager>
  </RecoilRoot>
  // </React.StrictMode>,
);

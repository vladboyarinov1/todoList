import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./app/App";
import { Provider } from "react-redux";
import { store } from "app/store";
import "./common/styles/fonts.module.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
);

reportWebVitals();

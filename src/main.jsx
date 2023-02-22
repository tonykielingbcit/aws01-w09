import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from "./components/AppRouter.jsx";
import "./styles/reset.css";
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);

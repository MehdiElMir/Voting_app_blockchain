import { useEffect, useState } from "react";

import Voting from "./Voting.json";
import { ethers } from "ethers";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Drawer,
  Input,
  Row,
  Typography,
} from "antd";
import { IoIosPersonAdd } from "react-icons/io";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import VotingPage from "./pages/VotingPage";

const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/voting",
      element: <VotingPage />,
    },
  ]);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2396e6",
          fontFamily: "Roboto",
        },
      }}
    >
      <RouterProvider router={router}></RouterProvider>
    </ConfigProvider>
  );
}

export default App;

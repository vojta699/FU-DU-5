import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import ListRoute from "./components/listDetail/ListRoute";
import SettingsProvider from "./components/UI/SettingsProvider";
import UserProvider from "./components/userProvider/UserProvider";
import ListsProvider from "./components/listsProvider/ListsProvider"

const App = () => {
  return (
    <div style={componentStyle()}>
      <SettingsProvider>
        <ListsProvider>
          <UserProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route
                    index
                    element={
                      <Dashboard />
                    }
                  />
                  <Route
                    path="listDetail"
                    element={
                      <ListRoute />
                    }
                  />
                  <Route path="*" element={"not found"} />
                </Route>
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </ListsProvider>
      </SettingsProvider>
    </div>
  )
}

function componentStyle() {
  return {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "white",
  };
}

export default App
import { Outlet } from "react-router-dom";
import NavBar from "../navBar/NavBar";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { useContext } from "react";
import { SettingsContext } from "../UI/SettingsContext";
import Icon from '@mdi/react';
import { mdiThemeLightDark } from '@mdi/js';

const Layout = () => {
  const { theme, toggleTheme } = useContext(SettingsContext);
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  function bodyStyle() {
    return {
      overflow: "auto",
      padding: "16px",
      flex: "1",
      borderTop: "#DEE2E6 4px solid",
      borderBottom: "#DEE2E6 4px solid",
      backgroundColor: theme.backgroundColorMain
    };
  }

  function footerStyle() {
    return { padding: "8px", textAlign: "center", fontSize: "15px", backgroundColor: theme.backgroundColor, color: theme.color };
  }

  return (
    <>
      {/* Layout aplikace */}
      <div className="card-header" style={{ backgroundColor: theme.backgroundColor }}>
        <NavBar />
      </div>
      <div style={bodyStyle()}>
        <Outlet />
      </div>
      <div className={"card-footer"} style={footerStyle()}>
        {i18n.language === "cz" ?
          <img
            src="/images/united-kingdom.svg"
            alt="United Kingdom"
            onClick={() => changeLanguage("en")}
            style={{ cursor: "pointer", width: "24px", height: "24px", marginRight: "10px" }}
          />
          :
          <img
            src="/images/czech-republic.svg"
            alt="Czech Republic"
            onClick={() => changeLanguage("cz")}
            style={{ cursor: "pointer", width: "24px", height: "24px", marginRight: "10px" }}
          />
        }
        <Icon onClick={toggleTheme} path={mdiThemeLightDark} size={1} style={{ cursor: "pointer" }} />
        <br />© Vojtěch Vihan
      </div>
    </>
  );
};

export default Layout;
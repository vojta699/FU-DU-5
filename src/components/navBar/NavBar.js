import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../userProvider/UserContext";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../UI/SettingsContext";
import Icon from "@mdi/react";
import { Spinner, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { mdiCart, mdiLogout, mdiLogin, mdiAccount } from "@mdi/js";

function NavBar() {
  const { theme } = useContext(SettingsContext);
  const { t } = useTranslation()
  const { userList, currentUser, handlerMap, loading, error } = useContext(UserContext);
  const navigate = useNavigate();

  if (loading) return <div style={{ display: "flex", justifyContent: "center" }}>
    <Spinner animation="border" variant="secondary" />
  </div>;
  if (error) return <p style={{ color: "white" }}>Error: {error}</p>;

  // Funkce pro generování seznamu uživatelů v dropdownu
  function getUserMenuList({ userList, currentUser, handlerMap }) {

    const userMenuItemList = userList.map((user) => (
      <NavDropdown.Item key={user.id} onClick={() => handlerMap.login(user.id)}>
        {user.name}
      </NavDropdown.Item>
    ));

    if (currentUser) {
      userMenuItemList.push(<NavDropdown.Divider key={"divider"} />);
      userMenuItemList.push(
        <NavDropdown.Item
          key={"logout"}
          onClick={() => handlerMap.logout()}
          style={{ color: "red" }}
        >
          <Icon path={mdiLogout} size={0.8} color={"red"} /> {t("navBar.logout")}
        </NavDropdown.Item>
      );
    }

    return userMenuItemList;
  }

  return (
    <Navbar expand="lg">
      <Container>
        {/* Logo + název aplikace */}
        <Navbar.Brand>
          <button style={{ fontSize: "20px", border: "none", backgroundColor: theme.backgroundColor, color: theme.color }} onClick={() => navigate("/")}>
            <Icon path={mdiCart} size={1} color={theme.color} />
            ShoppingListManager
          </button>
        </Navbar.Brand>
        {/* Dropdown pro přihlášení a odhlášení uživatele */}
        <Nav>
          <div style={{ color: theme.color, display: "inline-flex" }}>
            <NavDropdown
              title={
                currentUser ? (
                  <Icon path={mdiAccount} size={1} color={theme.color} />
                ) : (
                  <Icon path={mdiLogin} size={1} color={theme.color} />
                )
              }
              drop={"start"}
            >
              {getUserMenuList({ userList, currentUser, handlerMap })}
            </NavDropdown>
            <div style={{ marginTop: "10px", marginLeft: "5px" }}>
              {currentUser ? currentUser.name : ""}
            </div>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
}



export default NavBar;
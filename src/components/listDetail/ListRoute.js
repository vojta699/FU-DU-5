import Button from "react-bootstrap/esm/Button.js";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ListsContext } from "../listsProvider/ListsContext";
import ListDetail from "./ListDetail";
import { useLocation } from 'react-router-dom';
import { Spinner } from "react-bootstrap"
import { useTranslation } from "react-i18next";

function ListRoute() {
  const { t } = useTranslation()
  const navigate = useNavigate();

  // Načtení hodnot z providerů UserProvider a ListsProvider
  const { lists, loading, error } = useContext(ListsContext);

  // Získání id z params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const listId = searchParams.get("id");

  // Nastavení vybraného seznamu na základě zadaného id
  const [selectedList, setSelectedList] = useState(null);

  // Zavolání funkce setListFromUrl s hodnotu listId získanou z params
  useEffect(() => {
    const setListFromUrl = (listId) => {
      const list = lists.find((list) => list.id === listId);
      if (list) {
        setSelectedList(list);
      } else {
        setSelectedList(null); // nebo nějaký výchozí seznam
      }
    };

    if (listId) {
      setListFromUrl(listId);
    }
  }, [listId, lists]); // přidat 'lists' jako závislost

  // Pending / error
  if (loading) return <div style={{ display: "flex", justifyContent: "center" }}>
    <Spinner animation="border" variant="secondary" />
  </div>;
  if (error) return <p style={{ color: "white" }}>Error: {error}</p>;

  // Zpráva pokud je seznam nenalezen
  if (!selectedList) {
    return <div>{t("listDetail.notFound")}</div>;
  }

  return (
    <div
      className="card border-0 shadow rounded"
      style={componentStyle()}
    >
      <ListDetail list={selectedList} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="secondary" style={{ marginTop: "30px", width: "10vh" }} onClick={() => navigate("/")}>
          {t("listDetail.return")}
        </Button>
      </div>
    </div>
  )
}

function componentStyle() {
  return {
    margin: "12px auto",
    padding: "8px",
    display: "grid",
    columnGap: "8px",
    maxWidth: "1000px",
  };
}

export default ListRoute;

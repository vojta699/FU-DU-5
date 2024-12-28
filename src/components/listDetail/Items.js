import Container from "react-bootstrap/esm/Container.js";
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import { mdiCartArrowDown, mdiCartCheck, mdiDelete, mdiFoodAppleOutline } from "@mdi/js";
import { useState } from "react";
import ModalDelete from "./ModalDelete";

const Items = ({ item, list, updateList }) => {
    let { itemId, name, status } = item

    // Funkce pro odebrání položky ze seznamu
    const deleteItemFromList = (itemId) => {
        const updatedList = {
            ...list,
            items: list.items.filter((item) => item.itemId !== itemId),
        };
        // Aktualizace seznamu na serveru
        updateList(list.id, updatedList);
    };

    // Funkce pro změnu stavu položky
    const changeItemStatus = () => {
        const updatedList = {
            ...list,
            items: list.items.map((item) =>
                item.itemId === itemId
                    ? { ...item, status: item.status === "UNSOLVED" ? "SOLVED" : "UNSOLVED" }
                    : item
            ),
        }
        // Aktualizace seznamu na serveru
        updateList(list.id, updatedList);
    };

    // Modální okno pro odebrání itemu
    const [showModalItem, setShowModalItem] = useState(false);
    const openModalItem = () => setShowModalItem(true);
    const closeModalItem = () => setShowModalItem(false);

    return (
        <div style={{ marginTop: "5px" }}>
            <Container
                className="card border-0 shadow rounded"
                style={{
                    maxWidth: "300px",
                    maxHeight: "100px",
                    width: "100%",
                    marginTop: "12px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                }}
            >
                {/* Název položky */}
                <Col
                    md={6}
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                        }}
                    >
                        <Icon path={mdiFoodAppleOutline} size={0.7} style={{ marginRight: "5px", flexShrink: 0 }} />
                        <p
                            style={{
                                margin: 0,
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                            }}
                        >
                            {name}
                        </p>
                    </div>
                </Col>
                {/* Tlačítka pro smazání a nastavení statusu položky */}
                <Col
                    md={4}
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                    }}
                >
                    <Button
                        variant="danger"
                        onClick={openModalItem}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "white",
                            color: "red",
                            borderColor: "#e5e5e5",
                            transition: "background-color 0.3s ease, color 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f5f5f5"; // Zašednutí
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "white"; // Původní barva
                        }}
                    >
                        <Icon path={mdiDelete} size={0.7} />
                    </Button>
                    <Button
                        style={status === "UNSOLVED" ? {
                            backgroundColor: "white",
                            color: "#0e68ce",
                            borderColor: "#e5e5e5",
                            padding: "5px 10px",
                            transition: "background-color 0.3s ease, color 0.3s ease"
                        } : {
                            backgroundColor: "white",
                            color: "green",
                            borderColor: "#e5e5e5",
                            padding: "5px 10px",
                            transition: "background-color 0.3s ease, color 0.3s ease"
                        }}
                        onClick={() => changeItemStatus()}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f5f5f5"; // Zašednutí
                            e.target.style.color = status === "UNSOLVED" ? "#0e68ce" : "green"; // Změna barvy textu
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = status === "UNSOLVED" ? "white" : "white"; // Barva varianty
                            e.target.style.color = status === "UNSOLVED" ? "#0e68ce" : "green"; // Reset barvy textu
                        }}
                    >
                        <Icon
                            path={status === "UNSOLVED" ? mdiCartArrowDown : mdiCartCheck}
                            size={0.7}
                        />
                    </Button>
                </Col>
            </Container>
            {/* Modální okno */}
            <ModalDelete
                show={showModalItem}
                handleClose={closeModalItem}
                handleDelete={deleteItemFromList}
                entityId={itemId}
                entityType="item"
            />
        </div>

    )
}

export default Items
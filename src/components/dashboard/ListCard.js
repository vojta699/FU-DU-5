import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Card } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiEyeOutline, mdiDelete } from "@mdi/js";
import { useState, useEffect } from "react";
import ModalDeleteList from "./ModalDeleteList"
import "./ListCard.css"
import { useTranslation } from "react-i18next";

const ListCard = ({ list, currentUser, deleteList, updateList }) => {
    const { t } = useTranslation()
    const navigate = useNavigate();

    // Změna statusu vybraného listu
    const [updatedList, setUpdatedList] = useState(list)
    const changeListStatus = (newStatus) => {
        setUpdatedList((prevList) => ({
            ...prevList,
            status: newStatus,
        }));
    };

    // Funkce pro toggle (status)
    const [isChecked, setIsChecked] = useState(list.status === "ACTIVE");
    const handleToggle = (e) => {
        setIsChecked(e.target.checked);
        if (isChecked) {
            changeListStatus("ARCHIVED")
        } else if (!isChecked) {
            changeListStatus("ACTIVE")
        }
    };

    // Volání funkce pro update
    useEffect(() => {
        // Pokud se `updatedList` skutečně změní, zavolej `updateList`
        if (updatedList.status !== list.status) {
            updateList(updatedList.id, updatedList);
        }
    }, [updatedList, list.status, updateList]);


    // Definice useState
    const [showModalDeleteList, setShowModalDeleteList] = useState(false);
    const openModalDeleteList = () => setShowModalDeleteList(true);
    const closeModalDeleteList = () => setShowModalDeleteList(false);

    // Ověření vlastnicví a členství
    const isOwner = currentUser && list.ownerUserId === currentUser.id
    const isMember = () => {
        if (!currentUser || !list || !Array.isArray(list.members)) {
            return false;
        }
        return list.members.includes(currentUser.id);
    };

    // Pokud není owner ani člen, nic nevykresluj
    if (!isOwner && !isMember()) {
        return null;
    }
    // Vypsání listů
    return (
        <>


            {/* Vypsání názvu listu a tlačítka na přechod do route s konkrétním detailem listu */}
            <Card className="d-flex flex-column align-items-center justify-content-center card border-0 shadow rounded" style={componentStyle()}>
                {/* Vypsání názvu listu */}
                <Card.Body className="text-center">
                    <Card.Title>{list.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {isOwner ? t("listCard.owner") : t("listCard.member")}
                    </Card.Subtitle>
                    <Card.Text>{t("listCard.state")} {list.status === "ACTIVE" ? t("listCard.active") : t("listCard.archived")}</Card.Text>

                    <Row className="d-flex justify-content-center">
                        {isOwner ?
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={handleToggle}
                                />
                                <span className="slider"></span>
                            </label>
                            :
                            ""
                        }
                    </Row>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-center w-100">
                    <Row>
                        {/* Tlačítko pro detail, které by mělo být vždy ve středu */}
                        <Col className="d-flex justify-content-center">
                            <Button
                                onClick={() => navigate("/listDetail?id=" + list.id)}
                                style={{
                                    backgroundColor: "white",
                                    color: "#0e68ce",
                                    borderColor: "#e5e5e5",
                                    padding: "5px 10px",
                                    transition: "background-color 0.3s ease, color 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#f5f5f5";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "white";
                                }}
                            >
                                <Icon path={mdiEyeOutline} size={0.7} />
                            </Button>
                        </Col>
                        {/* Tlačítko pro smazání listu pro vlastníky */}
                        {isOwner && (
                            <Col className="d-flex justify-content-center">
                                <Button
                                    variant="danger"
                                    onClick={openModalDeleteList}
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
                            </Col>
                        )}
                    </Row>
                </Card.Footer>
            </Card>


            {/* Modální okno */}
            <ModalDeleteList
                show={showModalDeleteList}
                handleClose={closeModalDeleteList}
                handleDelete={deleteList}
                list={list}
            />
        </>
    )
}

function componentStyle() {
    return {
        maxWidth: "300px",
        margin: "12px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
    };
}

export default ListCard;
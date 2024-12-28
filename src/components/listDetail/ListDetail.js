import Container from "react-bootstrap/esm/Container.js";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Col } from "react-bootstrap";
import { useContext } from "react";
import { UserContext } from "../userProvider/UserContext";
import { ListsContext } from "../listsProvider/ListsContext";
import Members from "./Members";
import Items from "./Items";
import { useState } from "react";
import Icon from "@mdi/react";
import { mdiCartPlus, mdiPencil, mdiAccountPlus } from "@mdi/js";
import ModalAddItem from "./ModalAddItem";
import ModalAddMember from "./ModalAddMember";
import ModalEditListName from "./ModalEditListName"
import { useTranslation } from "react-i18next";

const ListDetail = ({ list }) => {
    const { t } = useTranslation()
    // Načtení hodnot z providerů UserProvider a ListsProvider
    const { userList, checkPermissionsForList, currentUser } = useContext(UserContext);
    const { handlerMap } = useContext(ListsContext);
    const { updateList } = handlerMap

    // useState
    const [deletedMembers, setDeletedMembers] = useState([]);

    // Filtrace položek podle statusu pro daný list
    const [filterItemStatus, setFilterItemStatus] = useState("ALL");
    const getFilteredItems = (listId) => {
        return list.items.filter((item) => {
            if (filterItemStatus === "ALL") {
                return true;
            }
            return item.status === filterItemStatus;
        });
    };
    const filteredItems = getFilteredItems(list.id);

    // Získání oprávnění pro aktuální list
    const { canView, canEdit, canAddItem, canAddMember } = checkPermissionsForList(list.id);

    // Filtrace uživatelů, kteří nejsou členy listu (pro účel modálního okna)
    const notMembers = userList.filter(user => !list.members.includes(user.id) && user.id !== list.ownerUserId);

    // List owner
    const showedListOwner = userList.find((e) => {
        return e.id === list.ownerUserId
    })

    // Modální okno pro úpravu názvu listu
    const [showModalListName, setShowModalListName] = useState(false);
    const openModalListName = () => setShowModalListName(true);
    const closeModalListName = () => setShowModalListName(false);

    // Modální okno pro přidání membera
    const [showModalMember, setShowModalMember] = useState(false);
    const openModalMember = () => setShowModalMember(true);
    const closeModalMember = () => setShowModalMember(false);

    // Modální okno pro přidání itemu
    const [showModalItem, setShowModalItem] = useState(false);
    const openModalItem = () => setShowModalItem(true);
    const closeModalItem = () => setShowModalItem(false);

    // Pokud nemá uživatel právo na zobrazení listu, vypíšeme zprávu
    if (!canView) {
        return (
            <Container style={{ display: "flex", justifyContent: "center" }}>
                <Row>
                    <h4>{t("listDetail.noPermision")}</h4>
                </Row>
            </Container>
        );
        // Pokud má právo, vypíšeme list
    } else
        return (
            <>
                <Container>

                    {/* Nadpis název listu */}
                    <Row>
                        <h4 style={{ display: "flex", justifyContent: "center" }}>{list.name}</h4>
                    </Row>

                    {/* Tlačítko pro úpravu názvu listu */}
                    <Row style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "5px"
                    }}>
                        {canEdit && (
                            <Button
                                variant="secondary"
                                onClick={openModalListName}
                                style={{ width: "8vh" }}
                            >
                                <Icon path={mdiPencil} size={0.7} />
                            </Button>
                        )}
                    </Row>

                    {/* Nadpis vlastník + vypsání vlastníka */}
                    <Col style={{
                        marginTop: "10px",
                        border: "2px solid #e5e5e5",
                        borderRadius: "20px",
                        padding: "0 10px",
                        height: "40px",
                        backgroundColor: "#444444",
                        color: "white"

                    }}>
                        <p style={{ paddingTop: "5px" }}>
                            <strong>{t("listDetail.owner")} </strong>
                            <span style={{ marginLeft: "10px" }}>{showedListOwner.name}</span>
                        </p>
                    </Col>

                    {/* Členové */}
                    <Col style={{
                        marginTop: "10px",
                        border: "2px solid #e5e5e5",
                        borderRadius: "20px",
                        padding: "0 10px",
                        paddingBottom: "10px"

                    }}>
                        {/* Nadpis členové + tlačíko přidat člena */}
                        <Row
                            style={{
                                borderRadius: "20px 20px 0px 0px",
                                backgroundColor: "#444444",
                                color: "white"
                            }}
                        >
                            <div style={{
                                textAlign: "left",
                                marginBottom: "5px",
                                paddingTop: "5px"
                            }}>
                                <strong>{t("listDetail.members")} </strong>
                            </div>
                        </Row>
                        <Row style={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            {canAddMember && (
                                <Button
                                    variant="success"
                                    onClick={openModalMember}
                                    style={{ width: "8vh" }}
                                >
                                    <Icon path={mdiAccountPlus} size={0.7} />
                                </Button>
                            )}

                        </Row>

                        {/* Vypsání všech memberů */}
                        <Row md={4}>
                            {list.members.map((member) => (
                                <Members
                                    key={member}
                                    member={member}
                                    list={list}
                                    setDeletedMembers={setDeletedMembers}
                                    deletedMembers={deletedMembers}
                                    updateList={updateList}
                                    ownerUserId={list.ownerUserId}
                                    currentUserId={currentUser.id}
                                />
                            ))}
                        </Row>
                    </Col>

                    {/* Položky */}
                    <Col style={{
                        marginTop: "10px",
                        border: "2px solid #e5e5e5",
                        borderRadius: "20px",
                        paddingBottom: "10px"

                    }}>
                        {/* Nadpis položky + tlačítko na přidání položky */}
                        <Row
                            style={{
                                borderRadius: "20px 20px 0px 0px",
                                margin: "0 0px",
                                backgroundColor: "#444444",
                                color: "white"
                            }}
                        >
                            <div style={{
                                textAlign: "left",
                                marginBottom: "5px",
                                paddingTop: "5px"
                            }}>
                                <strong>{t("listDetail.items")}</strong>
                            </div>
                        </Row>
                        <Row style={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            {canAddItem && (
                                <Button
                                    variant="success"
                                    onClick={openModalItem}
                                    style={{ width: "8vh" }}
                                >
                                    <Icon path={mdiCartPlus} size={0.7} />
                                </Button>
                            )}

                        </Row>
                        {/* Zobrazení vyfiltrovaného seznamu položek */}
                        <Row style={{ padding: "0 10px" }}>
                            <div style={{ marginTop: "20px" }}>
                                <strong>{t("listDetail.show")} </strong>
                                <button
                                    style={{ margin: "0 10px", borderStyle: "none", backgroundColor: "white", color: "#444444", fontWeight: filterItemStatus === "UNSOLVED" ? "bold" : "normal" }}
                                    onClick={() => setFilterItemStatus("UNSOLVED")}
                                >
                                    {t("listDetail.unsolved")}
                                </button>
                                <button
                                    style={{ marginRight: "10px", borderStyle: "none", backgroundColor: "white", color: "#444444", fontWeight: filterItemStatus === "ALL" ? "bold" : "normal" }}
                                    onClick={() => setFilterItemStatus("ALL")}
                                >
                                    {t("listDetail.solved")}
                                </button>
                            </div>
                        </Row>
                        {/* Vypsání všech položek */}
                        <Row md={3} style={{ padding: "0 10px" }}>
                            {filteredItems.map((item) => {
                                return (
                                    <Items
                                        key={item.itemId}
                                        item={item}
                                        updateList={updateList}
                                        list={list}
                                    />
                                )
                            })}
                        </Row>
                    </Col>

                </Container>
                {/* Modální okna */}
                <ModalEditListName
                    show={showModalListName}
                    handleClose={closeModalListName}
                    updateList={updateList}
                    list={list}
                />

                <ModalAddMember
                    show={showModalMember}
                    handleClose={closeModalMember}
                    notMembers={notMembers}
                    updateList={updateList}
                    setDeletedMembers={setDeletedMembers}
                    list={list}
                />

                <ModalAddItem
                    show={showModalItem}
                    handleClose={closeModalItem}
                    updateList={updateList}
                    list={list}
                />
            </>

        )
}


export default ListDetail
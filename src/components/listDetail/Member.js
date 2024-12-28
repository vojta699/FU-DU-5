import Container from "react-bootstrap/esm/Container.js";
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import { mdiDelete, mdiAccountOutline } from "@mdi/js";
import { useState } from "react";
import ModalDelete from "./ModalDelete";

const Member = ({ member, isOwner, isSelf, list, setDeletedMembers, updateList }) => {
    const { id, name } = member;

    // Funkce pro odstranění člena
    const deleteMemberFromList = (memberId) => {
        const updatedList = {
            ...list,
            members: list.members.filter((id) => id !== memberId),
        };

        // Přidání člena do `deletedMembers`
        setDeletedMembers((prevDeletedMembers) => [...prevDeletedMembers, memberId]);

        // Aktualizace seznamu na serveru
        updateList(list.id, updatedList);
    };

    // Modální okno pro odebrání membera
    const [showModalMember, setShowModalMember] = useState(false);
    const openModalMember = () => setShowModalMember(true);
    const closeModalMember = () => setShowModalMember(false);

    return (
        <div>
            <Container
                className="card border-0 shadow rounded"
                style={{
                    maxWidth: "300px",
                    maxHeight: "45px",
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
                {/* Název membera */}
                <Col
                    md={7}
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
                        <Icon path={mdiAccountOutline} size={0.7} style={{ marginRight: "5px", flexShrink: 0 }} />
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

                {/* Tlačítko pro smazání membera pro jednotlivé oprávnění */}
                {(isOwner || isSelf) && (
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
                            onClick={openModalMember}
                            style={{ padding: "5px 10px", backgroundColor: "white", color: "red", borderColor: "#e5e5e5", transition: "background-color 0.3s ease, color 0.3s ease" }}
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
            </Container>

            {/* Modální okno */}
            <ModalDelete
                show={showModalMember}
                handleClose={closeModalMember}
                handleDelete={deleteMemberFromList}
                entityId={id}
                entityType="member"
            />
        </div>
    );
};

export default Member
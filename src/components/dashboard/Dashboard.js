import Container from "react-bootstrap/esm/Container.js";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import ListCard from './ListCard';
import { ListsContext } from "../listsProvider/ListsContext";
import { UserContext } from "../userProvider/UserContext";
import ModalCreateListForm from "./ModalCreateListForm"
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../UI/SettingsContext";


const Dashboard = () => {
    const { theme } = useContext(SettingsContext);
    const { t } = useTranslation()
    const { lists, handlerMap, loading, error } = useContext(ListsContext);
    const { currentUser, addMemberToList, userList } = useContext(UserContext)
    const { deleteList, addNewList, updateList } = handlerMap

    // Logika pro modální okno na přidání nového seznamu
    const [showModalCreateNewList, setShowModalCreateNewList] = useState(false);
    const openModalCreateNewList = () => setShowModalCreateNewList(true);
    const closeModalCreateNewList = () => setShowModalCreateNewList(false);

    // Filtrace listů podle statusu
    const [filterListStatus, setFilterListStatus] = useState("ARCHIVED");

    const getFilteredLists = () => {
        if (filterListStatus === "ARCHIVED") {
            return lists;
        }
        return lists.filter((list) => list.status === filterListStatus);
    };
    const filteredList = getFilteredLists()
    // Filtrace listů podle přístupových práv
    const filteredListWithPermisions = filteredList.filter((list) => {
        if (!currentUser || !list || !Array.isArray(list.members)) {
            return false;
        }
        return list.members.includes(currentUser.id) || list.ownerUserId === currentUser.id
    })

    // Znepřístupnění nepřihlášeným uživatelům
    if (!currentUser) {
        return <>
            <Col className="d-flex justify-content-center aling-items-center">
                <h4 style={{color: theme.colorMain}}>{t("dashboard.youHaveToLogin")}</h4>
            </Col>
        </>
    }
    // Pending / error
    if (loading) return <div style={{ display: "flex", justifyContent: "center" }}>
        <Spinner animation="border" variant="secondary" />
    </div>;
    if (error) return <p style={{ color: "white" }}>Error: {error}</p>;
    return (
        <>
            <Container>
                <Row>
                    {/* Základní rozvržení dashboardu pro umožnění přechodu na listDetail */}
                    <Col>
                        <h5 style={{ fontSize: "20px", marginBottom: "10px", color: theme.colorMain }}>
                            {t("dashboard.listInfo")} ({filteredListWithPermisions.length})
                        </h5>
                    </Col>
                    <Col className="text-end">
                        <Button variant="success" onClick={openModalCreateNewList}>
                            {t("dashboard.create")}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <div style={{color: theme.colorMain,}}>
                        {t("dashboard.show")}
                        <button
                            onClick={() => setFilterListStatus("ACTIVE")}
                            style={{
                                margin: "0 10px",
                                borderStyle: "none",
                                backgroundColor: theme.backgroundColorMain,
                                color: theme.colorMain,
                                fontWeight: filterListStatus === "ACTIVE" ? "bold" : "normal"
                            }}
                        >
                            {t("dashboard.active")}
                        </button>
                        <button
                            onClick={() => setFilterListStatus("ARCHIVED")}
                            style={{
                                marginRight: "10px",
                                borderStyle: "none",
                                backgroundColor: theme.backgroundColorMain,
                                color: theme.colorMain,
                                fontWeight: filterListStatus === "ARCHIVED" ? "bold" : "normal"
                            }}
                        >
                            {t("dashboard.all")}
                        </button>
                    </div>
                </Row>
                <Row className="my-4">
                    <Col>
                        <hr style={{ border: "1px solid #ddd", margin: "0" }} />
                    </Col>
                </Row>
                {filteredListWithPermisions.length === 0 ?
                    <Col className="d-flex justify-content-center aling-items-center">
                        <h4>{t("dashboard.nothing")}</h4>
                    </Col>
                    :
                    <>
                        <Row style={{ margin: "0 auto" }}>
                            {filteredList.map((list) => {
                                return (
                                    <ListCard
                                        key={list.id}
                                        list={list}
                                        currentUser={currentUser}
                                        deleteList={deleteList}
                                        updateList={updateList}
                                    />
                                );
                            })}
                        </Row>
                    </>
                }

            </Container>
            {/* Modální okno */}
            <ModalCreateListForm
                show={showModalCreateNewList}
                handleClose={closeModalCreateNewList}
                addNewList={addNewList}
                addMemberToList={addMemberToList}
                userList={userList}
                currentUser={currentUser}
            />

        </>
    )
}

export default Dashboard
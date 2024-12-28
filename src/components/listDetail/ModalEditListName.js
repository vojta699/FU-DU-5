import { useState } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ModalAddMember = ({ show, handleClose, list, updateList }) => {
    const { t } = useTranslation()
    const [newName, setNewName] = useState("");
    const [validated, setValidated] = useState(false);

    // Funkce pro úpravu názvu seznamu
    const editListName = (newName) => {
        const updatedList = {
            ...list,
            name: newName
        };
        updateList(list.id, updatedList)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(true);

        if (newName.trim()) {
            editListName(newName);
            setNewName("");
            setValidated(false);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t("addModal.titleName")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Formulář pro změnu názvu listu */}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId="memberStatus" className="mt-3">
                        <Form.Label>{t("addModal.name")}</Form.Label>
                        <Form.Control
                            required
                            maxLength={20}
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={t("addModal.setName")}
                        />
                        <Form.Control.Feedback>
                        {t("addModal.looksGoodName")}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                        {t("addModal.alertName")}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Col className="d-flex justify-content-end mt-4">
                        {/* Tlačítko pro zrušení změny názvu */}
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                        {t("addModal.cancel")}
                        </Button>
                        {/* Tlačítko pro potvrzení změny názvu */}
                        <Button
                            type="submit"
                            variant="success"
                        >
                            {t("addModal.confirmName")}
                        </Button>
                    </Col>

                </Form>
            </Modal.Body>

        </Modal>
    );
};

export default ModalAddMember;
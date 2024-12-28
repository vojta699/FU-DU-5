import React, { useState } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from "react-i18next";

const ModalAddItem = ({ show, handleClose, list, updateList }) => {
    const { t } = useTranslation()
    const [itemName, setItemName] = useState("");
    const [itemStatus, setItemStatus] = useState("UNSOLVED");
    const [validated, setValidated] = useState(false);

    // Funkce pro přidání položky do seznamu
    const addItemToList = (newItem) => {
        const updatedList = {
            ...list,
            items: [...list.items, { itemId: Date.now(), ...newItem }],
        }
        // Aktualizace seznamu pomocí funkce updateList
        updateList(list.id, updatedList);
    };

    // Funkce pro validaci vstupních dat a odeslání formuláře na přidání položky
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        const form = event.currentTarget;

        if (form.checkValidity() === true) {
            addItemToList({ name: itemName, status: itemStatus });
            setItemName("");
            setItemStatus("UNSOLVED");
            setValidated(false);
            handleClose();
        }
    };



    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t("addModal.titleItem")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* Formulář pro název nové položky */}
                    <Form.Group controlId="itemName">
                        <Form.Label>{t("addModal.item")}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                required
                                type="text"
                                maxLength={20}
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder={t("addModal.setItem")}
                            />
                            <Form.Control.Feedback>
                                {t("addModal.looksGoodItem")}
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {t("addModal.alertItem")}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {/* Formulář pro status nové položky */}
                    <Form.Group controlId="itemStatus" className="mt-3">
                        <Form.Label>{t("addModal.state")}</Form.Label>
                        <Form.Select
                            value={itemStatus}
                            onChange={(e) => setItemStatus(e.target.value)}
                        >
                            <option value="UNSOLVED">{t("addModal.unsolved")}</option>
                            <option value="SOLVED">{t("addModal.solved")}</option>
                        </Form.Select>
                    </Form.Group>
                    <Col className="d-flex justify-content-end mt-4">
                        {/* Tlačítko pro zrušení vytvoření nové položky */}
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            {t("addModal.cancel")}
                        </Button>
                        {/* Tlačítko pro vytvoření nové položky */}
                        <Button type="submit" variant="success">
                            {t("addModal.confirmItem")}
                        </Button>
                    </Col>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalAddItem;
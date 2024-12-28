import { useState } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from "react-i18next";

const ModalAddMember = ({ show, handleClose, notMembers, setDeletedMembers, list, updateList }) => {
    const { t } = useTranslation()
    const [memberId, setMemberId] = useState("");
    const [validated, setValidated] = useState(false);

    // Funkce pro přidání člena do seznamu
    const addMemberToList = (newMemberId) => {
        const updatedList = {
            ...list,
            members: [...list.members, newMemberId],
        };

        // Aktualizace seznamu pomocí funkce updateList
        updateList(list.id, updatedList);

        // Odstranit člena ze seznamu `deletedMembers`, pokud existuje
        setDeletedMembers((prevDeletedMembers) =>
            prevDeletedMembers.filter((id) => id !== newMemberId)
        );
    };

    // Funkce pro validaci vstupních dat a odeslání formuláře na přidání člena
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() && memberId) {
            setValidated(true);
            addMemberToList(memberId);
            setMemberId("");
            setValidated(false);
            handleClose();
        } else {
            setValidated(true);
        }
    };

    if (notMembers.length === 0) {
        return (
            // Oznámení, když již nezbývá žádný uživatel, které by bylo možné přidat
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("addModal.announcement")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col>{t("addModal.message")}</Col>
                    <Col className="d-flex justify-content-end mt-4">
                        {/* Tlačítko pro zavření modálního okna */}
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Zpět
                        </Button>
                    </Col>

                </Modal.Body>
            </Modal>
        )
    } else {
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("addModal.tittleMember")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Formulář pro vybraní nového člena, kterého chceme přidat do listu */}
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="memberStatus" className="mt-3">
                            <Form.Label>{t("addModal.member")}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Select
                                    required
                                    value={memberId}
                                    onChange={(e) => setMemberId(e.target.value)}
                                    isInvalid={validated && !memberId}
                                >
                                    <option value="">{t("addModal.chooseMember")}</option>
                                    {notMembers.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {t("addModal.alertMember")}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Col className="d-flex justify-content-end mt-4">
                            {/* Tlačítko pro zrušení přidání nového člena */}
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                {t("addModal.cancel")}
                            </Button>
                            {/* Tlačítko pro přidání nového člena */}
                            <Button
                                type="submit"
                                variant="success"
                            >
                                {t("addModal.confirmMember")}
                            </Button>
                        </Col>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }


};

export default ModalAddMember;
import { Modal, Button, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";


const ModalDelete = ({ show, handleClose, handleDelete, entityId, entityType }) => {
    const { t } = useTranslation()
    // Dynamický text na základě typu entity
    const entityText = entityType === "member" ? t("deleteModal.textMember") : t("deleteModal.textItem");

    const onSubmit = () => {
        handleDelete(entityId);
        handleClose();
    };
    return (
        // Dynamické modální okno pro potvrzení smazání položky/člena
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t("deleteModal.confirmation")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {t("deleteModal.textQuestion")} {entityText}?
            
            <Col className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={handleClose} className="me-2">
                {t("deleteModal.cancel")}
                </Button>
                <Button
                    type="submit"
                    variant="danger"
                    onClick={onSubmit}
                >
                    {t("deleteModal.confirm")}
                </Button>
            </Col>
            </Modal.Body>
        </Modal>
    )
}

export default ModalDelete
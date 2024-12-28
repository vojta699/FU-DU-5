import { Modal, Button, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ModalDelete = ({ show, handleClose, handleDelete, list }) => {
    const { t } = useTranslation()
    const onSubmit = () => {
        handleDelete(list.id);
        handleClose();
    };
    return (
        // Modální okno pro potvrzení smazání listu
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t("deleteModal.confirmation")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {t("deleteModal.textList")} "{list.name}"?

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
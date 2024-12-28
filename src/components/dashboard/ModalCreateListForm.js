import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Alert } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Icon from "@mdi/react";
import { mdiDelete, mdiAccountPlus, mdiCartPlus } from "@mdi/js";
import { useTranslation } from "react-i18next";

const ModalCreateListForm = ({
  show,
  handleClose,
  addNewList,
  currentUser,
  userList,
}) => {
  const { t } = useTranslation()
  const [validated, setValidated] = useState(false);
  const [listName, setListName] = useState("");
  const [itemName, setItemName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [showAlertMember, setShowAlertMember] = useState(false);
  const [showAlertItem, setShowAlertItem] = useState(false);

  // formData
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    status: "ACTIVE",
    members: [],
    ownerUserId: "",
    items: [],
  });

  // Název list formData
  useEffect(() => {
    const addListNameToFormData = (listName) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: listName,
        ownerUserId: currentUser.id,
      }));
    };

    addListNameToFormData(listName);
  }, [listName, currentUser.id]);

  // Přidání a odebrání členů formData
  const notMembers = userList.filter(
    (user) =>
      !formData.members.includes(user.id) && user.id !== formData.ownerUserId
  );
  const addMemberToFormData = (memberId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      members: [...(prevFormData.members || []), memberId],
    }));
    setShowAlertMember(false);
  };

  const removeMemberFromFormData = (memberId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      members: prevFormData.members.filter((id) => id !== memberId),
    }));
  };

  // Přidání a odebrání položek formData
  const addItemToFormData = (itemName) => {
    const newItem = {
      itemId: new Date().getTime().toString(),
      name: itemName,
      status: "UNSOLVED",
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: [...prevFormData.items, newItem],
    }));
    setShowAlertItem(false);
  };

  const removeItemFromFormData = (itemId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: prevFormData.items.filter((item) => item.itemId !== itemId),
    }));
  };

  // Funkce pro validaci vstupních dat a odeslání formuláře na přidání položky
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      addNewList(formData);
      setListName("");
      setValidated(false);
      setFormData({
        id: "",
        name: "",
        status: "ACTIVE",
        members: [],
        ownerUserId: "",
        items: [],
      })
      setShowAlertMember(false);
      setShowAlertItem(false);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("createList.newList")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Formulář pro název nové položky */}
          <Form.Group controlId="listName">
            <Form.Label>{t("createList.name")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                maxLength={20}
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder={t("createList.setName")}
              />
              <Form.Control.Feedback>{t("createList.looksGoodName")}</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
              {t("createList.alertName")}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Formulář pro přidání členů */}
          <Form.Group controlId="memberStatus" className="mt-3">
            <Form.Label>{t("createList.members")}</Form.Label>
            <InputGroup>
              <Form.Select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              >
                <option value="">{t("createList.setMembers")}</option>
                {notMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Form.Select>
              <Button
                variant="success"
                className="ms-2"
                onClick={() => {
                  if (memberId) {
                    addMemberToFormData(memberId);
                    setMemberId("");
                  } else {
                    setShowAlertMember(true);
                  }
                }}
              >
                <Icon path={mdiAccountPlus} size={0.7} />
              </Button>
            </InputGroup>
            {showAlertMember ? (
              <Alert
                variant="warning"
                style={{
                  border: "none",
                  backgroundColor: "white",
                  color: "red",
                  padding: "5px 0",
                  fontSize: "14px",
                }}
              >
                {t("createList.alertMembers")}
              </Alert>
            ) : (
              ""
            )}
            {/* Výpis aktuálně přidaných členů */}
            <ul className="mt-3">
              {formData.members.map((memberId, index) => {
                return (
                  <li
                    key={memberId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span className="mb-3">{`${index + 1}. ${
                      userList.find((user) => user.id === memberId)?.name
                    }`}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeMemberFromFormData(memberId)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "white",
                        color: "red",
                        borderColor: "#e5e5e5",
                        transition:
                          "background-color 0.3s ease, color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                      }}
                    >
                      <Icon path={mdiDelete} size={0.7} />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Form.Group>

          {/* Formulář pro přidání položek */}
          <Form.Group controlId="itemName" className="mt-3">
            <Form.Label>{t("createList.items")}</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                maxLength={20}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={t("createList.setItems")}
              />
              <Button
                variant="success"
                className="ms-2"
                onClick={() => {
                  if (itemName) {
                    addItemToFormData(itemName);
                    setItemName("");
                  } else {
                    setShowAlertItem(true);
                  }
                }}
              >
                <Icon path={mdiCartPlus} size={0.7} />
              </Button>
            </InputGroup>
            {showAlertItem ? (
              <Alert
                variant="warning"
                style={{
                  border: "none",
                  backgroundColor: "white",
                  color: "red",
                  padding: "5px 0",
                  fontSize: "14px",
                }}
              >
                {t("createList.alertItems")}
              </Alert>
            ) : (
              ""
            )}
            {/* Výpis aktuálně přidaných položek */}
            <ul className="mt-3">
              {formData.items.map((item, index) => (
                <li
                  key={item.itemId}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span className="mb-3">{`${index + 1}. ${item.name}`}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItemFromFormData(item.itemId)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "white",
                      color: "red",
                      borderColor: "#e5e5e5",
                      transition: "background-color 0.3s ease, color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "white";
                    }}
                  >
                    <Icon path={mdiDelete} size={0.7} />
                  </Button>
                </li>
              ))}
            </ul>
          </Form.Group>
          <Col className="d-flex justify-content-end mt-4">
            {/* Tlačítko pro zrušení vytvoření nového listu */}
            <Button variant="secondary" onClick={handleClose} className="me-2">
            {t("createList.cancel")}
            </Button>
            {/* Tlačítko pro vytvoření nového listu */}
            <Button type="submit" variant="success">
            {t("createList.create")}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateListForm;

import { ListsContext } from "./ListsContext";
import { useState, useEffect } from "react";

function ListsProvider({ children }) {
  // Získání hodnoty z .env pro přepínání mezi mock a skutečným API
  const useMockData = process.env.REACT_APP_USE_MOCK === "true";
  const mockApiUrl = `${process.env.REACT_APP_MOCK_API_URL}/lists`;
  const apiUrl = `${process.env.REACT_APP_API_URL}/lists`;

  // Konečná URL pro komunikaci podle hodnoty useMockData
  const apiEndpoint = useMockData ? mockApiUrl : apiUrl;

  // Získání vstupních dat lists
  const [lists, setLists] = useState({
    loading: false,
    error: null,
    data: [],
  });

  useEffect(() => {
    const fetchLists = async () => {
      setLists((prev) => ({ ...prev, error: null, loading: true }))
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error("Failed to fetch lists");
        const data = await response.json();
        setLists((prev) => ({ ...prev, data: data }));
      } catch (err) {
        setLists((prev) => ({ ...prev, error: err.message }));
      } finally {
        setLists((prev) => ({ ...prev, loading: false }))
      }
    };

    fetchLists();
  }, [apiEndpoint]);

  // Přidání nového listu pomocí formData
  const addNewList = async (formData) => {
    const newList = {
      id: new Date().getTime().toString(),
      name: formData.name || '',
      status: "ACTIVE",
      ownerUserId: formData.ownerUserId || '',
      items: formData.items || [],
      members: formData.members || []
    };
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      });
      if (!response.ok) throw new Error("Failed to add new list");
      const addedList = await response.json();
      setLists((prev) => ({ ...prev, data: [...prev.data, addedList] }));
    } catch (err) {
      setLists((prev) => ({ ...prev, error: err.message }));
    }
  };

  // Odebrání vybraného listu
  const deleteList = async (listId) => {
    try {
      const response = await fetch(`${apiEndpoint}/${listId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete list");
      setLists((prev) => ({
        ...prev,
        data: prev.data.filter((list) => list.id !== listId),
      }));
    } catch (err) {
      setLists((prev) => ({ ...prev, error: err.message }));
    }
  }

  // Update vybraného listu
  const updateList = async (id, newData) => {
    try {
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error("Failed to update list");
      const updatedList = await response.json();
      setLists((prev) => ({
        ...prev,
        data: prev.data.map((list) => (list.id === id ? updatedList : list)),
      }));
    } catch (err) {
      setLists((prev) => ({ ...prev, error: err.message }));
    }
  }

  const value = {
    lists: lists.data || [],
    error: lists.error,
    loading: lists.loading,
    handlerMap: {
      addNewList,
      deleteList,
      updateList
    }

  };
  return <ListsContext.Provider value={value} > {children}</ListsContext.Provider >;
}

export default ListsProvider;

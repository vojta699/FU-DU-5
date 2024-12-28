import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { ListsContext } from "../listsProvider/ListsContext";

function UserProvider({ children }) {
  const { lists } = useContext(ListsContext);

  // Získání hodnoty z .env pro přepínání mezi mock a skutečným API
  const useMockData = process.env.REACT_APP_USE_MOCK === "true";
  const mockApiUrl = `${process.env.REACT_APP_MOCK_API_URL}/users`;
  const apiUrl = `${process.env.REACT_APP_API_URL}/users`;

  // Konečná URL pro komunikaci podle hodnoty useMockData
  const apiEndpoint = useMockData ? mockApiUrl : apiUrl;

  // Získání vstupních dat pro users
  const [userListDto, setUserListDto] = useState({
    error: null,
    loading: false,
    data: [],
  })

  useEffect(() => {
    const fetchUsers = async () => {
      setUserListDto((prev) => ({ ...prev, error: null, loading: true }))
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUserListDto((prev) => ({ ...prev, data: data }));
      } catch (err) {
        setUserListDto((prev) => ({ ...prev, error: err.message }));
      } finally {
        setUserListDto((prev) => ({ ...prev, loading: false }))
      }
    };

    fetchUsers();
  }, [apiEndpoint]);

  // Defaultní nastavení pro oprávnění uživatele
  const defaultPermissions = {
    canView: false,
    canEdit: false,
    canAddItem: false,
    canAddMember: false,
  };

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Funkce pro kontrolu práv přihlášeného uživatele pro konkrétní list
  const checkPermissionsForList = (listId) => {
    if (!loggedInUser) return defaultPermissions;

    const user = userListDto.data.find((user) => user.id === loggedInUser);
    const list = lists.find((list) => list.id === listId);

    if (!list || !user) return defaultPermissions;

    // Kontrola, zda uživatel je vlastník nebo člen listu
    const isOwner = list.ownerUserId === user.id;
    const isMember = list.members.includes(user.id);

    return {
      canView: isOwner || isMember, // Uživatel může vidět list, pokud je vlastníkem nebo členem
      canEdit: isOwner, // Pouze vlastník může upravit název
      canAddItem: isOwner || isMember, // Uživatel může přidávat položky, pokud je vlastníkem nebo členem
      canAddMember: isOwner, // Pouze vlastník může přidávat členy
    };
  };

  const value = {
    userList: userListDto.data || [],
    error: userListDto.error,
    loading: userListDto.loading,
    currentUser: loggedInUser
      ? userListDto.data.find((user) => user.id === loggedInUser)
      : null,
    handlerMap: {
      login: setLoggedInUser,
      logout: () => setLoggedInUser(null),
    },
    checkPermissionsForList,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
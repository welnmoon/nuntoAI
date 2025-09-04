const API_ROUTES = {
  register: "/api/register",
  login: "/api/login",
  logout: "/api/logout",
  chats: {
    create: "/api/chats",
    importGuest: "/api/chats/import",
    delete: "/api/chats/", // + chatId
  },
};

export default API_ROUTES;

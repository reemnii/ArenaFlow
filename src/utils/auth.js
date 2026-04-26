export function getStoredAuth() {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const token = localToken || sessionToken || "";

  let currentUser = null;

  try {
    currentUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));
  } catch {
    currentUser = null;
  }

  return {
    token,
    currentUser,
    isAuthenticated: Boolean(token && currentUser),
  };
}

export function getAuthToken() {
  return getStoredAuth().token;
}

export function getCurrentUser() {
  return getStoredAuth().currentUser;
}

export function setStoredAuth({ token, user, remember = false }) {
  const primaryStore = remember ? localStorage : sessionStorage;
  const secondaryStore = remember ? sessionStorage : localStorage;

  primaryStore.setItem("token", token);
  primaryStore.setItem("currentUser", JSON.stringify(user));
  primaryStore.setItem("isLoggedIn", "true");

  secondaryStore.removeItem("token");
  secondaryStore.removeItem("currentUser");
  secondaryStore.removeItem("isLoggedIn");
}

export function updateStoredUser(user) {
  [localStorage, sessionStorage].forEach((store) => {
    if (store.getItem("currentUser")) {
      store.setItem("currentUser", JSON.stringify(user));
    }
  });
}

export function clearStoredAuth() {
  [localStorage, sessionStorage].forEach((store) => {
    store.removeItem("token");
    store.removeItem("currentUser");
    store.removeItem("isLoggedIn");
  });
}

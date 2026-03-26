const getUserId = () => {
  let id = localStorage.getItem("userId");
  if (!id) {
    // Optional: check if the method exists to avoid crashing
    if (window.crypto && window.crypto.randomUUID) {
      id = window.crypto.randomUUID();
    } else {
      // Fallback to a timestamp/random string if absolutely necessary
      id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    localStorage.setItem("userId", id);
  }
  return id;
};
export const saveToLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.error(e);
  }
};

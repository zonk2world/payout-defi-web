/**
 * Load Value by key from storage
 */

export const load = (key) => {
    const value = localStorage.getItem(key);

    return value;
};

export const set = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const unset = (key) => {
    localStorage.removeItem(key);
};

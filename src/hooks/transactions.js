import {  useLocalStorage } from "./localstorage";

export const useTransactions = () => {
  const [transactions, setTransactions] = useLocalStorage('popTransactions', []);

  return [transactions, setTransactions]
};
export const generateTransactionRef = () => {
  return "TXN_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
};
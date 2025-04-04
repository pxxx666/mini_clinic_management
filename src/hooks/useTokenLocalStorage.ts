export const useTokenLocalStorage = () => {
  const get = () => {
    return localStorage.getItem('token') || '';
  };
  const set = (token: string) => {
    localStorage.setItem('token', token);
  };

  return {
    get,
    set,
  };
};

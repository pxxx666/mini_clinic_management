/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.UserVO } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser?.role === 'admin',
    canDoctor: currentUser && currentUser?.role === 'doctor',
    canPatient: currentUser && currentUser?.role === 'patient',
  };
}

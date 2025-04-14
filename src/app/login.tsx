import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase'; 
import useUserStore from '@/lib/zustand/useUserStore';

const LoginPage = () => {
  const { setUser } = useUserStore();
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      const accessToken = result.user.accessToken;
      if (user) {
        setUser({ id: user.uid, email: user.email, name: user.displayName, accessToken });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
};

export default LoginPage;
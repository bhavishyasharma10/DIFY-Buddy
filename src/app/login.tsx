import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase'; 
import { useUserStore } from '@/lib/zustand/useUserStore';

const LoginPage = () => {
  const { setUser } = useUserStore();
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      if (user) {
        setUser({ id: user.uid, email: user.email, name: user.displayName });
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
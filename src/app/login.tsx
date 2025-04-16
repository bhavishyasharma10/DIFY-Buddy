import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { useUserStore } from '@/lib/zustand/useUserStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full hover:scale-105 transition-transform duration-200 ease-in-out"
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
    
  );
};

export default Login;
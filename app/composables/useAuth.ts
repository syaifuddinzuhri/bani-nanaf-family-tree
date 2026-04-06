import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from "firebase/auth";

export const useAuth = () => {
    const { $auth } = useNuxtApp();
    const user = useState<User | null>("user", () => null);
    const isLoadingAuth = useState("isLoadingAuth", () => true);

    onMounted(() => {
        onAuthStateChanged($auth as any, (currentUser) => {
            user.value = currentUser;
            isLoadingAuth.value = false;
        });
    });

    const login = async (email: string, pass: string) => {
        return signInWithEmailAndPassword($auth as any, email, pass);
    };

    const logout = async () => {
        await signOut($auth as any);
        user.value = null;
    };

    return { user, isLoadingAuth, login, logout };
};
import { useEffect } from "react";
import Sidebar from "./Sidebar";

export async function Layout({ children }) {
    const [user, setUser] = useState({ name: '', role: '', nis: '' });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const token = cookies.get('token');
        if (!token) navigate('/login');
        const user = jwtDecode(token);
        const storedUser = user.data;
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/login');
        }
    }, [navigate, checkToken]);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar user={user} opened={isOpen} />
            {children}
        </div>
    );
}
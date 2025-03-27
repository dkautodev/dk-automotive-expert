
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DriverAuthTabs from "@/components/auth/DriverAuthTabs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const DriverAuth = () => {
  const { isAuthenticated, role } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'chauffeur') {
        navigate('/dashboard/driver');
      } else if (role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/client');
      }
    }
  }, [isAuthenticated, navigate, role]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <DriverAuthTabs />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DriverAuth;

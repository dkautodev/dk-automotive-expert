
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthTabs from "@/components/auth/AuthTabs";
import { ResetPasswordForm } from "@/components/auth/sign-in/ResetPasswordForm";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const Auth = () => {
  const { isAuthenticated, role } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/client');
      }
    }

    // Vérifier si c'est une demande de réinitialisation de mot de passe
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const resetRequested = queryParams.get('reset') === 'true';
    
    if (type === 'recovery' || resetRequested) {
      setShowResetPassword(true);
    }
  }, [isAuthenticated, navigate, role, location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {showResetPassword ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ResetPasswordForm />
            </div>
          ) : (
            <AuthTabs />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;

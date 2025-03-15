
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthTabs from "@/components/auth/AuthTabs";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <AuthTabs />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;

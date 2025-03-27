
import { ProfileProvider } from "./profile/ProfileContext";
import ProfileWrapper from "./profile/ProfileWrapper";

const Profile = () => {
  return (
    <ProfileProvider>
      <ProfileWrapper />
    </ProfileProvider>
  );
};

export default Profile;

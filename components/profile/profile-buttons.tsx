import { useSession } from "next-auth/react";

const ProfileButtons = () => {
  const session = useSession();
  if (!session.data) {
    return null; // or a loading state
  }
  return <div>{session.data.user.email}</div>;
};

export default ProfileButtons;

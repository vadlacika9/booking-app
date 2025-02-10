'use client'

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user.email);
    }
  }, [session]); // Csak akkor fusson, ha `session` változik
  
  if (status === "loading") {
    return <div>Loading...</div>; // Ha még nincs adat, mutassunk egy betöltő állapotot
  }

  return (
    <div>
      <p>Profile</p>
      <div>{user ? user : "No user data"}</div>
    </div>
  );
}

export default Profile;

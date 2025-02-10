'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const Users = () => {

  const [users, setUsers] = useState([]); // Állapot a felhasználók tárolására
  const [loading, setLoading] = useState(true); // Betöltés állapota

  const { data: session, status } = useSession();
  console.log(session)

  async function fetchUsers() {
    try {
      const response = await fetch('api/users'); // API meghívása
      const data = await response.json(); // JSON válasz feldolgozása
      setUsers(data); // Adatok állapotba mentése
    } catch (error) {
      console.error('Hiba történt az adatok lekérésekor:', error);
    } finally {
      setLoading(false); // Betöltés befejezése
    }
  }

  useEffect(() => {
    fetchUsers(); // Komponens betöltődésekor API meghívása
  }, []);

  if (loading) {
    return <div>Adatok betöltése...</div>;
  }

  if(status === 'unauthenticated'){
    return(
      <div>Be kell legyel jelentkezve</div>
    )
  }else{

    return (
      <div>
       <div>
      <h1>Welcome, {session?.user?.first_name} {session?.user?.last_name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p> {/* A szerepkör kiíratása */}
    </div>
      <div>
        <h1>Userek:</h1>
        <ul>
          {users.map(user => (
            <li key={user.user_id}>{user.first_name} {user.last_name}</li> // Felhasználók listázása
          ))}
        </ul>
      </div>
      </div>
    );
  }
  }
  
export default Users;
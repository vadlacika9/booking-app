'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import MyAppointments from "@/components/MyAppointments";
import MyServices from "@/components/MyServices";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { getInitial } from "@/utils/getInitials";
import { signOut } from "next-auth/react";
import MySettings from "../../components/MySettings"
import Image from "next/image";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [activeTab, setActiveTab] = useState("Profile");
  const { data: session, status } = useSession();
    const router = useRouter();

  useEffect(() => {

   

    if (session && session.user) { //checking the session & setting the user
      setUser(session.user);
    }
  }, [session, router, status]);

  // rendering content by the value of activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "My appointments":
        return <MyAppointments />;
      case "My services":
        return <MyServices />;
      case "Settings":
        return <MySettings/>; //need to specified
      default:
        return (
            <div className="pl-10 font-semibold text-gray-800 text-3xl">Welcome, {user.last_name}</div> //need to specified
          );
    }
  };

  
  

  if (status === "loading") {
    return <Loading/>;
  }


  return (
    <div className="max-w-7xl mx-auto flex items-start justify-between px-4 md:px-8">
  {/* Sidebar */}
  <aside className="w-1/3 dark:bg-gray-800 p-4 pr-0 border-r-2 border-gray-100 h-screen">
    <ul className="space-y-2 font-medium ">
      <div className="flex items-center py-4">
      <div className={`relative w-16 h-16 flex items-center justify-center ${session.user.profile_pic ? 'bg-white' : 'bg-indigo-500'} text-white font-bold text-4xl rounded-full`}>
  {session.user.profile_pic ? (
    <Image
      src={session.user.profile_pic}
      alt="Profilkép"
      fill
      className="object-cover rounded-full"
    />
  ) : (
    getInitial(session.user.last_name)
  )}
</div>

        <div className="pl-4 text-2xl">{session.user.first_name} {session.user.last_name}</div>
      </div>
      {["My appointments", "My services", "Settings"].map((tab) => (
        <li key={tab}>
          <button 
            onClick={() => setActiveTab(tab)}
            className={`flex w-full items-center p-2 border-b-2 border-gray-100 ${
              activeTab === tab ? "bg-indigo-500 text-white" : "text-gray-900 dark:text-white hover:bg-indigo-300 dark:hover:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        </li>
      ))}
      <li
            className="flex w-full items-center p-2 hover:bg-indigo-300 cursor-pointer border-b-2 border-gray-100"
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })} // Jelentkezzen ki és irányítsa a bejelentkezési oldalra
          >
            Log Out
          </li>
    </ul>
  </aside>

  {/* Content */}
  <main className="flex-1 p-6">
    {renderContent()}
  </main>
</div>

  );
}

export default Profile;

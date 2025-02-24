'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import MyAppointments from "@/components/MyAppointments";
import MyServices from "@/components/MyServices";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [activeTab, setActiveTab] = useState("Profile"); // Alapértelmezett tartalom
  const { data: session, status } = useSession();
    const router = useRouter();

  useEffect(() => {

    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }

    if (session && session.user) {
      setUser(session.user);
    }
  }, [session, router, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Tartalom meghatározása az aktív fül alapján
  const renderContent = () => {
    switch (activeTab) {
      case "My appointments":
        return <MyAppointments />;
      case "My services":
        return <MyServices />;
      case "Settings":
        return <p>⚙️ Settings content</p>;
      default:
        return (
            <div className="pl-10 font-semibold text-gray-800 text-3xl">Welcome, {user.last_name}</div>
          );
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex items-start justify-between px-4 md:px-8">
  {/* Sidebar */}
  <aside className="w-1/3 dark:bg-gray-800 p-4 pr-0 border-r-2 border-gray-100 h-screen">
    <ul className="space-y-2 font-medium ">
      <li className="p-2 border-b-2 border-gray-100">Profile</li>
      {["My appointments", "My services", "Settings"].map((tab) => (
        <li key={tab}>
          <button 
            onClick={() => setActiveTab(tab)}
            className={`flex w-full items-center p-2 border-b-2 border-gray-100 ${
              activeTab === tab ? "bg-gray-300 dark:bg-gray-700" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        </li>
      ))}
      <Link href="/api/auth/signout">
        <li className="flex w-full items-center p-2 hover:bg-gray-100 cursor-pointer border-b-2 border-gray-100">
          Log Out
        </li>
      </Link>
    </ul>
  </aside>

  {/* Tartalom */}
  <main className="flex-1 p-6">
    {renderContent()}
  </main>
</div>

  );
}

export default Profile;

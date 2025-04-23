//main profile page

'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import MyAppointments from "@/components/MyAppointments";
import MyServices from "@/components/MyServices";
import Loading from "@/components/Loading";
import { getInitial } from "@/utils/getInitials";
import { signOut } from "next-auth/react";
import MySettings from "../../components/MySettings";
import Image from "next/image";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [activeTab, setActiveTab] = useState("Profile");
  const { data: session, status } = useSession();

  useEffect(() => {
    //fetching my details
    const fetchDetails = async () => {
      const res = await fetch("/api/users/get-my-details");
      
      if (!res.ok) {
        throw new Error('Cannot get my details!');
      }
      
      const data = await res.json();
      setUser(data);
    };
    
    fetchDetails();
  }, []);

  // rendering content by the value of activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "My appointments":
        return <MyAppointments />;
      case "My services":
        return <MyServices />;
      case "Settings":
        return <MySettings />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="font-semibold text-gray-800 text-3xl mb-6">Welcome, {user.last_name}</h1>
            <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
              <p className="text-gray-700">
                Manage your appointments, services and account settings from this dashboard.
                Select an option from the sidebar to get started.
              </p>
            </div>
          </div>
        );
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  const navItems = [
    { name: "My appointments", icon: "📅" },
    { name: "My services", icon: "🛠️" },
    { name: "Settings", icon: "⚙️" }
  ];

  return (
    <div className="max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-white shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className={`relative w-16 h-16 flex items-center justify-center ${user.profile_pic ? 'bg-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} text-white font-bold text-3xl rounded-full shadow-sm overflow-hidden`}>
              {session.user.profile_pic ? (
                <Image
                  src={session.user.profile_pic}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              ) : (
                getInitial(session.user.last_name)
              )}
            </div>
            <div>
              <div className="text-xl font-medium text-gray-800">{user.first_name} {user.last_name}</div>
              <div className="text-sm text-gray-500">{session.user.email}</div>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.name 
                      ? "bg-indigo-500 text-white" 
                      : "text-gray-700 hover:bg-indigo-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
            
            <li className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
              >
                <span className="mr-3">🚪</span>
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Profile;
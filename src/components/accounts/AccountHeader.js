"use client";
import React, { useState, useEffect } from "react";
import { User, Edit } from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import axiosHttp from "@/utils/axioshttp";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";

const AccountHeader = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const userInfo = useSelector((state) => state.user?.userInfo);
  const userId = userInfo?.id;

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axiosHttp.get(`/profile/user-profile/${userId}`);
      const { data } = res.data;
      const [firstName, ...lastNameParts] = data.fullName.split(" ");
      const lastName = lastNameParts.join(" ");
      setUserData({
        id: data.id,
        firstName,
        lastName,
        email: data.email,
        gender: data.gender ? data.gender.toLowerCase() : "",
        phone: data.phone,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditClick = () => setIsModalOpen(true);

  const handleSaveProfile = async (updatedData) => {
    try {
      const payload = {
        fullName: `${updatedData.firstName} ${updatedData.lastName}`,
        email: updatedData.email,
        gender: updatedData.gender,
        phone: userData?.phone,
      };
      await axiosHttp.put(`/auth/update-user-profile`, payload);
      const data = {
        fullName: payload?.fullName,
        email: payload?.email,
      };
      dispatch(
        setUser({
          id: user.userInfo.id,
          fullName: data.fullName,
          email: data.email,
          phone: user.userInfo.phone,
          role: user.userInfo.role,
          token: user.token,
          refreshToken: user.refreshToken,
        })
      );
      await fetchUserData();
    } catch (error) {}
  };

  return (
    <div className="bg-[#27272a] w-full mt-[130px]">
      <div className="bg-[#27272a] border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        {/* Left: User Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>

          <div className="flex flex-col">
            {loading || !userData ? (
              <div className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-semibold text-white break-words">
                    {userData.firstName?.toUpperCase()}{" "}
                    {userData.lastName?.toUpperCase()}
                  </h1>
                  {userData.gender && (
                    <span className="text-xs sm:text-sm text-white/60 bg-zinc-900 px-2 py-1 rounded capitalize">
                      {userData.gender}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4 text-xs sm:text-sm text-white/60 mt-1">
                  <span>{userData.phone}</span>
                  <span className="truncate">{userData.email}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Edit Button */}
        <div className="flex justify-end sm:justify-center">
          <button
            onClick={handleEditClick}
            disabled={loading}
            className="flex items-center gap-1 sm:gap-2 border border-white/10 rounded-md px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Edit className="w-4 h-4 text-white" />
            <span className="hidden sm:inline text-white">Edit Profile</span>
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default AccountHeader;

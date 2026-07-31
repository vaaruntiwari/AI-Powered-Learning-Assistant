import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService"; // Ensure authService has updatePassword API

const ProfilePage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.name || "");
      setEmail(user.email || "");
      setLoading(false);
    }
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);

    try {
      // Calls update password service
      if (authService.updatePassword) {
        await authService.updatePassword({
          currentPassword,
          newPassword,
        });
      }
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader title="Profile Settings" />

      {/* User Information Display Section */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          User Information
        </h3>

        <div className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-neutral-400" />
              </div>
              <p className="w-full h-9 pl-9 pr-3 pt-2 text-sm border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-800 font-medium">
                {username || "N/A"}
              </p>
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-neutral-400" />
              </div>
              <p className="w-full h-9 pl-9 pr-3 pt-2 text-sm border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-800 font-medium">
                {email || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form Section */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password Input */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-9 pl-9 pr-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-9 pl-9 pr-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Confirm New Password Input */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-9 pl-9 pr-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
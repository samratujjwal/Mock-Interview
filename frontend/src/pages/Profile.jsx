import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api.js';
import useAuthStore from '../store/useAuthStore.js';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  // const user = useAuthStore((s) => s.user);
  // const { setUser, clearUser } = useAuthStore((s) => ({ setUser: s.setUser, clearUser: s.clearUser }));
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name || "" },
  });
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || null);

  useEffect(() => {
    reset({ name: user?.name || "" });
    setPreview(user?.avatar?.url || null);
  }, [user]);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      if (data.name) form.append("name", data.name);
      if (file) form.append("avatar", file);

      const res = await api.put("/users/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data?.data?.user || null;
      if (updated) setUser(updated);
      alert(res.data.message || "Profile updated");
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete your account? This is reversible only by admins."))
      return;
    try {
      const res = await api.delete("/users/account");
      alert(res.data.message || "Account deleted");
      await api.post("/auth/logout");
      clearUser();
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Avatar</label>
          <div className="mb-2">
            {preview ? (
              <img
                src={preview}
                alt="avatar preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                No avatar
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {preview && (
            <div className="mt-2">
              <button
                type="button"
                className="btn-secondary mr-2"
                onClick={async () => {
                  if (!confirm("Remove avatar?")) return;
                  try {
                    const res = await api.delete("/users/avatar");
                    const updated = res.data?.data?.user || null;
                    if (updated) setUser(updated);
                    setFile(null);
                    setPreview(updated?.avatar?.url || null);
                    alert(res.data.message || "Avatar removed");
                  } catch (err) {
                    alert(
                      err?.response?.data?.message || "Failed to remove avatar",
                    );
                  }
                }}
              >
                Remove avatar
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1">Name</label>
          <input className="input" {...register("name")} />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input className="input" value={user?.email} disabled />
        </div>

        <div>
          <button className="btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">Danger zone</h2>
        <button className="btn-danger" onClick={onDelete}>
          Delete account
        </button>
      </div>
    </div>
  );
}

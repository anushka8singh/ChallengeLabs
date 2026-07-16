import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Crown, ShieldCheck, Search, UserCog } from "lucide-react";

import {
  getUsers,
  updateUserPremium,
  updateUserRole,
  type AdminUser,
} from "../services/adminService";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePremium = async (
    user: AdminUser
  ) => {
    try {
      await updateUserPremium(
        user.id,
        !user.hasPremiumAccess
      );

      toast.success("Premium updated");

      loadUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleRole = async (
    user: AdminUser,
    role: "USER" | "ADMIN"
  ) => {
    try {
      await updateUserRole(
        user.id,
        role
      );

      toast.success("Role updated");

      loadUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.hasPremiumAccess).length;
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const avatarColors = [
    "um-avatar--purple",
    "um-avatar--blue",
    "um-avatar--green",
    "um-avatar--orange",
    "um-avatar--pink",
  ];

  const getAvatarColor = (name: string) => {
    const idx = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <div className="dashboard-page">

      {/* Page Header */}
      <div className="dashboard-welcome">
        <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative", zIndex: 1 }}>
          <div className="stat-icon stat-icon--purple" style={{ flexShrink: 0 }}>
            <UserCog size={18} />
          </div>
          <div>
            <h2 className="dashboard-welcome-title" style={{ fontSize: "26px" }}>
              User <span className="text-accent">Management</span>
            </h2>
            <p className="dashboard-welcome-sub" style={{ marginTop: "4px" }}>
              Manage user roles and premium access.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <Users size={18} />
          </div>
          <div>
            <p className="stat-value">{loading ? "—" : totalUsers}</p>
            <p className="stat-label">Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--yellow">
            <Crown size={18} />
          </div>
          <div>
            <p className="stat-value">{loading ? "—" : premiumUsers}</p>
            <p className="stat-label">Premium Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="stat-value">{loading ? "—" : adminUsers}</p>
            <p className="stat-label">Admins</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h3 className="dashboard-section-title">All Users</h3>
          {/* Search */}
          <div className="search-wrapper" style={{ maxWidth: "280px", flex: "initial" }}>
            <Search size={15} className="search-icon" />
            <input
              id="user-search"
              type="text"
              className="search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search users"
            />
          </div>
        </div>

        <div className="um-table-container">
          <div className="um-table-scroll">
            <table className="um-table">
              <thead className="um-thead">
                <tr>
                  <th className="um-th">User</th>
                  <th className="um-th">Email</th>
                  <th className="um-th">Role</th>
                  <th className="um-th">Premium</th>
                  <th className="um-th" style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  // Skeleton rows
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="um-tr">
                      <td className="um-td">
                        <div className="um-user-cell">
                          <div className="um-skeleton um-skeleton--avatar" />
                          <div className="um-skeleton um-skeleton--name" />
                        </div>
                      </td>
                      <td className="um-td"><div className="um-skeleton um-skeleton--email" /></td>
                      <td className="um-td"><div className="um-skeleton um-skeleton--badge" /></td>
                      <td className="um-td"><div className="um-skeleton um-skeleton--badge" /></td>
                      <td className="um-td"><div className="um-skeleton um-skeleton--actions" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state" style={{ padding: "60px 24px" }}>
                        <div className="empty-state-icon-wrap">
                          <Users size={28} />
                        </div>
                        <p className="empty-state-title">No users found</p>
                        <p className="empty-state-sub">
                          {search ? `No results for "${search}"` : "No users have registered yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="um-tr">
                      {/* Avatar + Name */}
                      <td className="um-td">
                        <div className="um-user-cell">
                          <div className={`um-avatar ${getAvatarColor(user.name)}`} aria-hidden="true">
                            {getInitial(user.name)}
                          </div>
                          <span className="um-user-name">{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="um-td">
                        <span className="um-email">{user.email}</span>
                      </td>

                      {/* Role Badge */}
                      <td className="um-td">
                        <span className={`um-badge ${user.role === "ADMIN" ? "um-badge--admin" : "um-badge--user"}`}>
                          {user.role === "ADMIN" ? "Admin" : "User"}
                        </span>
                      </td>

                      {/* Premium Badge */}
                      <td className="um-td">
                        <span className={`um-badge ${user.hasPremiumAccess ? "um-badge--premium" : "um-badge--basic"}`}>
                          {user.hasPremiumAccess ? "⭐ Premium" : "Basic"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="um-td">
                        <div className="um-actions">
                          {/* Premium Toggle */}
                          <div className="um-toggle-group">
                            <span className="um-toggle-label">Premium</span>
                            <button
                              className={`um-toggle ${user.hasPremiumAccess ? "um-toggle--on" : ""}`}
                              onClick={() => handlePremium(user)}
                              role="switch"
                              aria-checked={user.hasPremiumAccess}
                              aria-label={`Toggle premium for ${user.name}`}
                              title={user.hasPremiumAccess ? "Remove premium" : "Grant premium"}
                            >
                              <span className="um-toggle-thumb" />
                            </button>
                          </div>

                          {/* Role Toggle */}
                          <div className="um-toggle-group">
                            <span className="um-toggle-label">Admin</span>
                            <button
                              className={`um-toggle ${user.role === "ADMIN" ? "um-toggle--on" : ""}`}
                              onClick={() =>
                                handleRole(
                                  user,
                                  user.role === "ADMIN" ? "USER" : "ADMIN"
                                )
                              }
                              role="switch"
                              aria-checked={user.role === "ADMIN"}
                              aria-label={`Toggle admin role for ${user.name}`}
                              title={user.role === "ADMIN" ? "Remove admin" : "Make admin"}
                            >
                              <span className="um-toggle-thumb" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="um-table-footer">
              Showing {filtered.length} of {totalUsers} user{totalUsers !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
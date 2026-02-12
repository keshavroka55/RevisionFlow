// src/pages/Dashboard.js
export default function Test({ user }) {
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Role: {user.role}</p>
      <button
        onClick={async () => {
          await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}

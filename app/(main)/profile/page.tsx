export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>
        {/* Placeholder for user settings form */}
        <div>
            <p>Username: User123</p>
            <p>Email: user123@example.com</p>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-6">Search History</h2>
        {/* Placeholder for search history */}
        <ul>
            <li>"Best running shoes for marathon"</li>
            <li>"Laptop for programming under $1000"</li>
        </ul>
      </div>
    </div>
  );
}

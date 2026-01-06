const Settings = () => {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>

        {/* Notifications */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Notifications</h4>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" checked />
            Email notifications for order updates
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" className="form-checkbox" />
            SMS notifications for promotions
          </label>
        </div>

        {/* Security */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Security</h4>
          <p>Password: ••••••••</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Change Password
          </button>
        </div>

        {/* Preferences */}
        <div>
          <h4 className="font-semibold mb-2">Preferences</h4>
          <p>Language: English</p>
          <p>Currency: INR</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

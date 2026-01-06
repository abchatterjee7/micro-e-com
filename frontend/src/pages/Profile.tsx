import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
        <div className="flex items-center gap-6 mb-6">
          <img
            src="https://i.pravatar.cc/150"
            alt="avatar"
            className="w-28 h-28 rounded-full border"
          />
          <div>
            <p className="text-gray-600 mb-2">Name</p>
            <h3 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h3>

            <p className="text-gray-600 mt-4">Email</p>
            <h3 className="text-lg">{user?.email}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded">
            <h4 className="font-semibold mb-2">Account Details</h4>
            <p>Username: {user?.username}</p>
            <p>Password: ••••••••</p>
          </div>
          <div className="p-4 border rounded">
            <h4 className="font-semibold mb-2">Address</h4>
            <p>Banjara Hills, Road no 12</p>
            <p>HiTech City, Hyderabad-50017, Telangana</p>
            <p>India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from 'react-loading';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

const baseUrl = `${import.meta.env.VITE_BASEURL}/user`
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    const loweredcased = email.toLowerCase()
    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email:loweredcased, password, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Registration failed');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-800 relative flex-col">
        <div className='text-4xl text-white font-serif font-semibold absolute top-5'>
        Task.M
      </div>
    <div className="bg-white p-6 rounded-lg shadow-md sm:w-96 w-full m-2">
      <h2 className="text-2xl font-bold text-center mb-4 font-mono tracking-widest border-b-2 border-black mx-20">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-black/70 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-black/70 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-black/70 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 text-black focus:ring-blue-600"
          >
            <option value="member" >Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center">
              <Loading type="bars" color="#fff" height={25} width={25} />
            </div>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
    </div>
  );
};

export default Register;

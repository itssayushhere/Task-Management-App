import  { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from 'react-loading';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state , dispatch } = useContext(AuthContext);
  const validateForm = () => {
    if (!email || !password) {
      setError('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };
const baseUrl = `${import.meta.env.VITE_BASEURL}/user`
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const lowercasedEmail = email.toLowerCase();
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email : lowercasedEmail,password}),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Login failed');
      } else {
        dispatch({
          type: 'LOGIN',
          payload: {
              token: true,
              name: result.name
          }
      });
        toast.success("Successfully login")
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-800 flex-col relative">
      <div className='text-4xl text-white font-serif font-semibold absolute top-20'>
        Task.M
      </div>
    <div className="bg-white p-6 rounded-lg shadow-md sm:w-96 w-full border-2 border-black">
      <h2 className="text-2xl font-bold text-center mb-4 font-mono tracking-widest border-b-2 border-black mx-20">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-black/50  w-full px-4 py-2 mt-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold">Password :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-black/50  w-full px-4 py-2 mt-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
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
            'Login'
          )}
        </button>
      </form>

      <p className="mt-4 text-center">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
    </div>
  );
};

export default Login;

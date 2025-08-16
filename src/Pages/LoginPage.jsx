import { useMutation } from '@tanstack/react-query';
import { Cpu } from 'lucide-react'; 
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SmallSpinner from '../components/SmallSpinner';
import { login } from '../services/apiBlog';

const LoginPage = () => {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const location = useLocation();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (response) => {
      if (!response?.access || !response?.refresh) {
        toast.error('Invalid response from server');
        return;
      }
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      toast.success('Signed in successfully');
      setTimeout(() => {
        const from = location?.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }, 120);
    },
    onError: (err) => {
      toast.error(err?.message || 'Login failed');
    }
  });

  function onSubmit(data) {
    mutation.mutate(data);
  }

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative overflow-hidden">
        {/* Left: image + form (keep your tilted card feel) */}
        <div className="w-[60%] -mb-10 -ml-5 overflow-hidden flex -rotate-6">
          {/* Image */}
          <div className="w-1/2">
            <img
              src="/images/AboutUs2.jpg"
              alt="Clinic"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form */}
          <div className="w-1/2 p-10 flex flex-col bg-white rounded-r-2xl justify-center">
            <div className="flex items-center space-x-2 mb-5">
              <Cpu size={28} className="text-blue-600" />
              <h2 className="text-xl font-bold text-black tracking-wide">
                <span className="text-blue-600">Lead</span>Flow
              </h2>
            </div>

            <h2 className="font-bold text-gray-800 mb-2">
              Sign in to your intake dashboard
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Capture leads, qualify instantly, auto-book, and track outcomes.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label htmlFor="username" className="block text-xs font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Your username"
                  className="w-full mt-2 py-2 px-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors?.username?.message && (
                  <p className="text-red-600 text-xs mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full mt-2 py-2 px-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors?.password?.message && (
                  <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <>
                    <SmallSpinner />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: product value (about the system, blue/gray/black palette) */}
        <div className="absolute top-0 right-0 w-[40%] h-full px-8 py-20 bg-white flex flex-col justify-center border-l border-gray-100">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4 leading-tight">
            Intake & Booking, Done Right
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            A single flow from click → intake → instant triage → booked.
            Built for dental teams that live on speed-to-lead.
          </p>
          <ul className="text-sm text-gray-800 space-y-2">
            <li>✅ <span className="text-blue-600 font-medium">28-sec HIPAA-ready intake</span></li>
            <li>✅ <span className="text-blue-600 font-medium">Auto-qualify & smart follow-ups</span></li>
            <li>✅ <span className="text-blue-600 font-medium">Front desk SMS in 5s to book</span></li>
            <li>✅ <span className="text-blue-600 font-medium">Calendar sync & no-show nudges</span></li>
            <li>✅ <span className="text-blue-600 font-medium">Ad attribution & conversion loop</span></li>
          </ul>

          <div className="mt-6 text-center">
            <span className="inline-block text-xs text-gray-500 mb-1">Don’t have access?</span>
            <a
              href="/request-access"
              className="text-blue-600 font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
            >
              Request access
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

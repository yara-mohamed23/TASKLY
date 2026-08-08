'use client';
import React, { useState } from 'react';
import { validateLoginForm, LoginFormErrors } from './validation';
import { logInUsers } from './logInUsers';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    const isValid = Object.keys(validationErrors).length === 0;
    
    if (!isValid) {
      return;
    }

    console.log('بيانات صالحة! جاري الإرسال للـ API...', formData);
    setIsLoading(true);

    const res = await logInUsers(formData);
    setIsLoading(false);

    if (res.success) {
      if (formData.rememberMe) {
        localStorage.setItem('token', res.data.access_token);
      } else {
        sessionStorage.setItem('token', res.data.access_token);
      }
      router.push('/project');
    } else {
      console.log('سبب رفض السيرفر:', res.error);
      setApiError(res.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-surface-low)] p-4">
      <div className="text-[color:var(--color-primary)] font-bold text-title-md">
        <span className="">🗹</span>
        TASKLY
      </div>

      <div className="w-full mb-6 mx-auto bg-[color:var(--color-background)] border border-[color:var(--color-border-light)] rounded-[8px] max-w-[576px] p-6 md:p-12 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-headline-lg font-bold text-[color:var(--color-text-dark)] mb-2">
            Welcome Back
          </h1>
          <p className="text-body-md text-[color:var(--color-text-muted)]">
            Please enter your details to access your workspace{' '}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {apiError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="w-full">
            <label className="w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  className="w-full pl-4 pr-10 py-3 border border-[color:var(--color-border-light)] rounded text-body-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] bg-[color:var(--color-surface-low)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-dark)] text-body-md"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                id="rememberMe"
                onChange={handleChange}
                className="m-1 border border-[color:var(--color-border-light)] rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] bg-[color:var(--color-surface-low)]"
              />
              <label
                className="font-bold text-[color:var(--color-text-dark)] text-label-sm cursor-pointer"
                htmlFor="rememberMe"
              >
                Remember Me
              </label>
            </div>

            <div className="flex-1 text-right">
              <span className="font-bold text-[color:var(--color-primary)] text-label-sm cursor-pointer">
                Forgot Password?{' '}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-container)] active:scale-[0.99] transition-all text-white font-medium rounded text-body-md shadow-sm flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center text-body-md text-[color:var(--color-text-muted)]">
          Don't have an account?{' '}
          <a
            href="/signUp"
            className="text-[color:var(--color-primary)] font-semibold"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
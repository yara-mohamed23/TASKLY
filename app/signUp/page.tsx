'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { validateName, validateEmail, passwordCriteria } from './validation';
import { signUpUser } from './signUpUser';

export default function Page() {
  const router = useRouter();

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Password validation checks
  const currentPassword = formData.password;
  const isMinLength = passwordCriteria.minLength(currentPassword);
  const isNoWhitespace = passwordCriteria.noWhitespace(currentPassword);
  const isUpperLowerDigit = passwordCriteria.hasUpperLowerDigit(currentPassword);
  const isSpecial = passwordCriteria.hasSpecial(currentPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // مسح الخطأ بمجرد أن يبدأ المستخدم في الكتابة مجدداً
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // تصفير الأخطاء القديمة

    // 1. تفتيش البيانات
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);

    let passwordErr = null;
    if (!formData.password) {
      passwordErr = "Password is required.";
    } else if (!isMinLength || !isUpperLowerDigit || !isSpecial || !isNoWhitespace) {
      passwordErr = "Password does not meet all security guidelines.";
    }

    let confirmPasswordErr = null;
    if (formData.password !== formData.confirmPassword) {
      confirmPasswordErr = "Passwords do not match.";
    }

    // 2. إذا كان هناك خطأ، نوقف العملية
    if (nameErr || emailErr || passwordErr || confirmPasswordErr) {
      setErrors({
        name: nameErr || "",
        email: emailErr || "",
        password: passwordErr || "",
        confirmPassword: confirmPasswordErr || "",
      });
      setIsSubmitting(false);
      return;
    }

    // 3. الإرسال للسيرفر
    const response = await signUpUser(formData);

    if (response?.success) {
      router.push('/project');
    } else {
      setErrors({ api: response?.error || 'Failed to sign up. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-surface-low)] p-4">
      <div className="text-[color:var(--color-primary)] font-bold text-title-md mb-4">
        <span className="">🗹</span>
        TASKLY
      </div>
      
      {/* Main Container */}
      <div className="w-full mb-6 mx-auto bg-[color:var(--color-background)] border border-[color:var(--color-border-light)] rounded-[8px] max-w-[576px] p-6 md:p-12 shadow-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-headline-lg font-bold text-[color:var(--color-text-dark)] mb-2">
            Create your workspace
          </h1>
          <p className="text-body-md text-[color:var(--color-text-muted)]">
            Join the editorial approach to task management.
          </p>
        </div>

        {/* عرض رسالة الخطأ من السيرفر إن وجدت */}
        {errors.api && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
            {errors.api}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="w-full">
            <label className="w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="w-full">
            <label className="w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Job Title Field */}
          <div className="w-full">
            <label className="w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
              Job Title <span className="text-[color:var(--color-text-muted)] pl-1 font-normal">optional</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter Job Title"
              className="w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
            />
            {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
          </div>

          {/* Passwords Fields */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Password Field */}
            <div className="flex-1">
              <label className="block w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="flex-1">
              <label className="block w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
                Confirm Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-container)] active:scale-[0.99] transition-all text-white font-medium rounded text-body-md shadow-sm flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-body-md text-[color:var(--color-text-muted)]">
          Already have an account?{' '}
          <a href="/login" className="text-[color:var(--color-primary)] font-semibold">
            Log in
          </a>
        </div>

      </div>
    </div>
  );
}
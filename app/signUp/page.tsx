'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData, // 1. انسخ كل البيانات القديمة زي ما هي
      [e.target.name]: e.target.value, // 2. غير بس الخانة اللي شغالين عليها دلوقتي
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault();

	console.log("🚀 الزرار اتداس عليه والدالة اشتغلت!"); // 👈 ضيفي السطر ده للتأكد
    console.log("البيانات المكتوبة:", formData);
    let newErrors: Record<string, string> = {};
    if (!formData.name) {
      newErrors.name = 'الاسم مطلوب!';
    }
    if (!formData.email) {
      newErrors.email = 'الإيميل مطلوب!';
    }
    if (!formData.jobTitle) {
      newErrors.jobTitle = 'الوظيفة مطلوبه!';
    }
    if (!formData.password) {
      newErrors.password = 'كلمة السر مطلوبة!';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات السر غير متطابقة!';
    }

    setErrors(newErrors);
	console.log("الأخطاء اللي طلعت:", newErrors); // 👈 وده عشان تشوف الأخطاء

    // 🎯 الخطوة الجاية: لو مفيش أي أخطاء (البيانات سليمة 100%)
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // هنا بنحاكي إرسال البيانات للـ API / Server
      setTimeout(() => {
        alert('تم إنشاء الحساب بنجاح! 🎉');

        // 1. تصفير الـ Form
        setFormData({
          name: '',
          email: '',
          jobTitle: '',
          password: '',
          confirmPassword: '',
        });

        setIsSubmitting(false);

        // 2. التوجيه لصفحة الـ Login
        router.push('/login');
      }, 1500);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[color:var(--color-surface-low)] p-4">
        <div className="text-[color:var(--color-primary)] font-bold text-title-md">
          <span className="">🗹</span>
          TASKLY
        </div>
        {/* Main Container */}
        <div
          className="w-full mb-6 bg-[color:var(--color-background)] 
		  border border-[color:var(--color-border-light)] rounded-[8px] max-w-[576px] p-6 md:p-12 shadow-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-headline-lg font-bold text-[color:var(--color-text-dark)] mb-2">
              Create your workspace
            </h1>
            <p className="text-body-md text-[color:var(--color-text-muted)]">
              Join the editorial approach to task management.
            </p>
          </div>

          {/* Name Field */}
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                className={`w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3
				rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]`}
              />
			  {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            {/* Email Field */}
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
                className={`w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded
				focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]`}
              />
			  {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            {/* Job Title Field */}
            <div className="w-full">
              <label className="w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
                Job Title
                <span className="text-[color:var(--color-text-muted)] pl-1">
                  optional
                </span>
              </label>
              <input
                type="text"
                name="jobTitle"
				value={formData.jobTitle}
				onChange={handleChange}
                placeholder="Enter Job Title"
                className={`w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded
				focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]`}
              />
			{errors.jobTitle && <p className="text-red-500">{errors.jobTitle}</p>}
            </div>
            {/* Password Field */}
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <label className="block w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Your Password"
                    className={`w-full  pl-4 pr-10 py-3 border border-[color:var(--color-border-light)] rounded text-body-md 
					focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] bg-[color:var(--color-surface-low)]`}
                  />
                  <button
				  type='button'
                    onClick={() => {
                      setShowPass(!showPass);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)] 
			  hover:text-[color:var(--color-text-dark)] text-body-md"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
				{errors.password && <p className="text-red-500">{errors.password}</p>}
              </div>
              {/* Confirm Password Field */}
              <div className="flex-1">
                <label className="block w-full font-bold text-[color:var(--color-text-dark)] text-label-sm">
                  Confirm Password
                </label>
                <input
                  type="text"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`w-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-low)] p-3 rounded
					focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]`}
                />
              </div>
			  	{errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-container)] 
			active:scale-[0.99] transition-all text-white font-medium rounded text-body-md shadow-sm flex items-center 
			justify-center disabled:opacity-70 disabled:pointer-events-none"
            >Create Account</button>
          </form>

          <div className="mt-6 text-center text-body-md text-[color:var(--color-text-muted)]">
            Already have an account?
            <a
              href="/login"
              className="text-[color:var(--color-primary)] font-semibold"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

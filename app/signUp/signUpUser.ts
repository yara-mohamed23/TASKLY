export const signUpUser = async (formData: any) => {
  try {
    const response = await fetch(
      'https://ahzkooeyjnhrbsuqbzza.supabase.co/auth/v1/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '',
          Authorization: 'Bearer sb_secret_3AJKvpYNZ5WWE3_tPQc2yg_2taJHx-9',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          data: {
            name: formData.name,
            jobTitle: formData.jobTitle || '',
          },
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.log('السيرفر رفض التسجيل والسبب:', result.msg || result.message);
      return { success: false, error: result.msg || result.message };
    } else {
      console.log('تم التسجيل بنجاح!', result);
      return { success: true, data: result };
    }
  } catch (error) {
    console.log('حصلت مشكلة في الاتصال بالإنترنت أو السيرفر:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

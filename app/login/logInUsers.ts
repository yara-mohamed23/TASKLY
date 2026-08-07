export const logInUsers = async (formData: any) => {
  try {
    const response = await fetch(
      'https://ahzkooeyjnhrbsuqbzza.supabase.co/auth/v1/token?grant_type=password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '',},
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.log(
        'السيرفر رفض تسجيل الدخول والسبب:',
        result.msg || result.error_description,
      );
      return {
        success: false,
        error:
          result.msg || result.error_description || 'Invalid email or password',
      };
    }

    console.log('تم تسجيل الدخول بنجاح!', result);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log('حصلت مشكلة في الاتصال بالإنترنت أو السيرفر:', error);
  }
  return {
    success: false,
    error: 'Network error. Please try again.',
  };
};

export interface LoginFormValues {
	email?: string;
  password?: string;
  [key:string]: string |boolean | undefined;
}
export interface LoginFormErrors{
	email?: string;
  password?: string;
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @param {Object} values 
// @returns {Object} errors

export const validateLoginForm = (values:LoginFormValues) : LoginFormErrors =>{
	let errors : LoginFormErrors = {};

	if(!values.email || !values.email.trim()){
		errors.email = "Email is required.";
	}
	else if (!EMAIL_REGEX.test(values.email)){
		errors.email = "Email does not meet all security guidelines.";
	}
	if(!values.password || !values.password.trim()) {
		errors.password = "Password is required.";}

	return errors
}
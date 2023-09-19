import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../features/auth/authSlice";
import Dropzone from "../Components/Dropzone";
import { closeSlide } from "../features/info/infoSlice";
import Navbar from "../Components/Navbar"

function LoginPage() {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [avatarImg, setAvatarImg] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginPageInitialValues = { email: "", password: "" };
  const SignupPageInitialValues = {
    name: "",
    email: "",
    bio: "",
    password: "",
  };

  const handleDropzoneValue = (value) => {
    setAvatarImg(value);
  };

  const handleSubmit = async (values, actions) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const signupApi = `${apiBaseUrl}/api/auth/signup`;
    const loginApi = `${apiBaseUrl}/api/auth/login`;

    if (isLoginPage) {
      const res = await fetch(loginApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(setAuth(data));
        actions.setSubmitting(false);
        dispatch(closeSlide());
        navigate("/");
      } else {
        console.log("wrong credentials");
      }
    } else {
      // This allows us to send form info with image
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      formData.append("avatarImg", avatarImg);
      formData.append("avatarImgName", avatarImg.name);

      const res = await fetch(signupApi, {
        method: "POST",
        body: formData,
      });
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        dispatch(setAuth(data));
        actions.setSubmitting(false);
        dispatch(closeSlide());
        navigate("/");
      } else {
        console.log("wrong credentials");
      }
    }
  };

  return (
    <>
      <Navbar />
      <Formik
        initialValues={
          isLoginPage ? loginPageInitialValues : SignupPageInitialValues
        }
        onSubmit={handleSubmit}>
        <Form
          className={`${
            isLoginPage ? "mt-24" : "mt-12"
          } flex flex-col items-center gap-5`}>
          {isLoginPage ? undefined : (
            <Dropzone isAvatar={true} onDropzoneValue={handleDropzoneValue} />
          )}
          {isLoginPage ? undefined : (
            <Field
              type="text"
              name="name"
              placeholder="Full Name"
              className="inputField"
            />
          )}
          <Field
            type="email"
            name="email"
            placeholder="email"
            className="inputField"
          />
          {isLoginPage ? undefined : (
            <Field
              type="text"
              as="textarea"
              name="bio"
              placeholder="Write about yourself..."
              className="inputField h-[68px] py-2"
            />
          )}
          <Field
            type="password"
            name="password"
            placeholder="password"
            className="inputField"
          />
          <button
            type="submit"
            className="btn bg-zinc-950 dark:bg-stone-50 text-white dark:text-stone-950 hover:bg-zinc-800 hover:dark:bg-stone-200 w-10/12 max-w-xl h-10">
            {isLoginPage ? "Login" : "Signup"}
          </button>
        </Form>
      </Formik>
      <button
        type="button"
        onClick={() => setIsLoginPage(!isLoginPage)}
        className="mt-12 w-2/3 max-w-xl h-8 bg-transparent text-black  dark:text-stone-50 hover:text-zinc-600 hover:dark:text-stone-400 font-Roboto">
        {isLoginPage
          ? "Don’t have an account? Join"
          : "Already have an account? Login"}
      </button>
    </>
  );
}

export default LoginPage;

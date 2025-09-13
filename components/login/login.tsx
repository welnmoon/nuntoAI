import LoginForm from "../form/login/login-form";

const Login = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(0,123,255,0.35), transparent 50%),
          radial-gradient(circle at 80% 40%, rgba(0,200,255,0.25), transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(100,180,255,0.3), transparent 50%),
          #0f1226
        `,
      }}
    >
      <LoginForm />
    </div>
  );
};

export default Login;

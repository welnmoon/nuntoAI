"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form-input";
import SecondaryButton from "@/components/buttons/secondary-button";
import Heading from "@/components/headers/heading";
import { loginSchema } from "./loginSchema";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { useState } from "react";

const LoginForm = ({ onToggle }: { onToggle?: () => void }) => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLoginSubmit = async () => {
    setLoading(true);
    const login = await signIn("credentials", {
      email: form.getValues("email"),
      password: form.getValues("password"),
      redirect: false,
    });

    if (login?.error) {
      toast.error(login.error);
      setLoading(false);
      return;
    } else {
      toast.success("Вы успешно вошли в систему!");
      setLoading(false);
      router.replace(CLIENT_ROUTES.home);
      router.refresh();
    }
  };
  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-white shadow-[0_0_0_1px_rgba(255,255,255,.06)]">
      <Heading level={2} className="mb-1 text-white">
        Вход в аккаунт
      </Heading>
      <p className="mb-4 text-sm text-gray-300">Рады видеть вас снова</p>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onLoginSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput name="email" label="Email" placeholder="Введите email" />
          <FormInput
            name="password"
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
          />
          <SecondaryButton loading={loading} type="submit" text="Войти" />
        </form>
      </FormProvider>
      <p className="mt-4 text-sm text-gray-300 text-center">
        Нету аккаунта?{" "}
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            className="text-cyan-400 hover:underline"
          >
            Регистрация
          </button>
        ) : (
          <a href="/register" className="text-cyan-400 hover:underline">
            Регистрация
          </a>
        )}
      </p>
    </div>
  );
};

export default LoginForm;

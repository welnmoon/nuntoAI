"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form-input";
import SecondaryButton from "@/components/buttons/secondary-button";
import Heading from "@/components/headers/heading";
import { loginSchema } from "./loginSchema";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { CLIENT_ROUTES } from "@/lib/client-routes";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async () => {
    const login = await signIn("credentials", {
      email: form.getValues("email"),
      password: form.getValues("password"),
      redirect: false,
    });

    if (login?.error) {
      toast.error(login.error);

      return;
    } else {
      toast.success("Вы успешно вошли в систему!");
      redirect(CLIENT_ROUTES.home);
    }
  };
  return (
    <div className="w-[300px] bg-white p-6 rounded-xl">
      <Heading level={2} className="mb-4">
        Авторизация
      </Heading>
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
          <SecondaryButton type="submit" text="Войти" />
        </form>
      </FormProvider>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Нету аккаунта?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Регистрация
        </a>
      </p>
    </div>
  );
};

export default LoginForm;

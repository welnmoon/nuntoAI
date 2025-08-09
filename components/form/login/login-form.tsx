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

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  });

  const onLoginSubmit = async () => {
    const login = await signIn("credentials", {
      email: form.getValues("email"),
      password: form.getValues("password"),
      fullName: form.getValues("fullName"),
      redirect: false,
    });

    if (login?.error) {
      toast.error(login.error);
      redirect("/");
      return;
    } else {
      toast.success("Вы успешно вошли в систему!");
      redirect("/");
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
          <FormInput
            name="fullName"
            label="Полное имя"
            placeholder="Введите полное имя"
          />
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

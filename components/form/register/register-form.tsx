"use client";

import { FormProvider, useForm } from "react-hook-form";
import { registerSchema, registerSchemaType } from "./registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form-input";
import SecondaryButton from "@/components/buttons/secondary-button";
import Heading from "@/components/headers/heading";
import API_ROUTES from "@/lib/api-routes";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  });

  const onRegisterSubmit = async () => {
    const res = await fetch(API_ROUTES.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.getValues() as registerSchemaType),
    });
    const data = await res.json();
    const { email, hashedPassword, fullName } = data;
    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    const login = await signIn("credentials", {
      email,
      hashedPassword,
      fullName,
      redirect: false,
    });
    if (login?.error) {
      toast.error(login.error);
      return;
    }

    toast.success(
      "Вы успешно зарегистрированы! Пожалуйста, войдите в систему."
    );
    router.replace("/");
  };
  return (
    <div className="w-[300px] bg-white p-6 rounded-xl">
      <Heading level={2} className="mb-4">
        Регистрация
      </Heading>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onRegisterSubmit)}
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
          <SecondaryButton type="submit" text="Зарегистрироваться" />
        </form>
      </FormProvider>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Уже зарегистрированы?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Войти
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;

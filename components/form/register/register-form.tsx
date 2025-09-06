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
import { CLIENT_ROUTES } from "@/lib/client-routes";

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
    try {
      const payload = form.getValues() as registerSchemaType; // { email, password, fullName, ... }

      const res = await fetch(API_ROUTES.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // попробуем прочитать тело, но бережно
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        const msg =
          data && typeof data === "object" && data !== null && "error" in data
            ? (data as { error?: string }).error || undefined
            : undefined;
        toast.error(msg ?? `Ошибка регистрации (${res.status})`);
        return;
      }

      // Успешно зарегистрирован → сразу логиним тем же email/password из формы
      const login = await signIn("credentials", {
        email: payload.email,
        password: payload.password, 
        redirect: false,
      });

      if (login?.error) {
        toast.error(login.error);
        return;
      }

      toast.success("Вы успешно зарегистрированы и вошли в систему!");
      router.replace(CLIENT_ROUTES.home);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Неизвестная ошибка";
      toast.error(message);
    }
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

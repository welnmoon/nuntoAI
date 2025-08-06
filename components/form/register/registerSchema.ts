import z from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Полное имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export type registerSchemaType = z.infer<typeof registerSchema>;

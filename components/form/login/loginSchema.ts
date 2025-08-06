import z from "zod";

export const loginSchema = z.object({
  fullName: z.string().min(2, "Полное имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

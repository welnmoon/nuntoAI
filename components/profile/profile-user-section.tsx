import Image from "next/image";
import { User } from "@prisma/client";

const ProfileUserSection = ({ user }: { user: User }) => {
  return (
    <main className="flex flex-col items-center py-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg px-8 py-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Профиль пользователя</h1>
        {user?.image ? (
          <div className="flex justify-center mb-4">
            <Image
              src={user.image}
              alt={user.name || "User avatar"}
              width={80}
              height={80}
              className="rounded-full border"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-zinc-800 mx-auto mb-4 flex items-center justify-center text-3xl text-gray-400">
            <span role="img" aria-label="Avatar">
              👤
            </span>
          </div>
        )}
        <div className="mb-2">
          <span className="font-semibold">Имя:&nbsp;</span>{" "}
          {user?.name || "Не указано"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email:&nbsp;</span>{" "}
          {user?.email || "Не указано"}
        </div>
        <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">ID:&nbsp;</span>{" "}
          {user?.id || "Неизвестно"}
        </div>
      </div>
    </main>
  );
};

export default ProfileUserSection;

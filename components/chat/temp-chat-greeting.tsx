import Heading from "../headers/heading";

const TempChatGreeting = ({
  isTemporary,
  userName,
}: {
  isTemporary: boolean;
  userName: string;
}) => {
  return (
    <div className="text-center">
      {!isTemporary ? (
        <Heading level={2} className="">
          Добро пожаловать в Nunto AI, {userName}
        </Heading>
      ) : (
        <div>
          <Heading level={2} className="">
            Временный чат
          </Heading>
          <p className="text-center w-100 text-gray-500 dark:text-gray-400 mb-10">
            Этот чат не появится в журнале, не будет использовать или обновлять
            память Nunto AI и не будет использоваться для обучения наших
            моделей.
          </p>
        </div>
      )}
    </div>
  );
};

export default TempChatGreeting;

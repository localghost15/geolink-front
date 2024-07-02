import React, { useState, useEffect } from 'react';
import { Card, Button} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { login, isLoggedIn, getUserRole } from '../services/authServices';
import toast from 'react-hot-toast';
import { Checkbox, Divider, Form, Input, Typography, Spin  } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

function Login() {
  const [loginValue, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Состояние для спинера
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка, если пользователь уже залогинен
    if (isLoggedIn()) {
      navigate('/', { replace: true });
    }

    // Установка таймера для спинера на 2 секунды
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, []);

  const handleLogin = async () => {
    const response = await login(loginValue, password);
    if (response.success) {
      navigate('/', { replace: true });
      toast.success('Сиз муваффақиятли тизимга кирдингиз!');
    } else {
      console.error(response.message);
      toast.error('Кириш маълумотлари нотўғри!');
    }

    const userRole = await getUserRole();
    if (userRole) {
      console.log('Роль пользователя:', userRole);
    } else {
      console.error('Не удалось получить роль пользователя');
    }
  };

  return (
      <div className="relative overflow-hidden h-screen flex items-center justify-center bg-gray-50">
        {loading ? (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-white">
              <Spin tip="Загрузка..." size="large"/>
            </div>
        ) : (
            <section className="flex items-center justify-center ">
              <video
                  autoPlay
                  loop
                  muted
                  className="absolute z-[0] w-auto min-w-full min-h-screen max-w-none"
              >
                <source
                    src="/authBg.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="container mx-auto h-full p-10">
                <div
                    className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
                  <div className="w-full">
                    <div className="block rounded-xl max-w-lg mx-auto shadow-lg dark:bg-neutral-800"
                         style={{backgroundColor: 'rgba(255, 255, 255,1)', backdropFilter: 'blur(4px)'}}>
                      <div className="g-0 lg:flex justify-center lg:flex-wrap">
                        <div className="px-4 md:px-0 ">
                          <div className="md:p-12 mx-auto">
                            <Card className="mx-auto" color="transparent" shadow={false}>
                              <div className='mb-1 mx-auto'>
                                <img src="/logomain.svg" alt="Логотип"/>
                              </div>
                              <Form onFinish={handleLogin} className="mt-3 mb-2 w-80 max-w-screen-lg sm:w-96">
                                <div className="mb-1 flex flex-col gap-6">
                                  <div>
                                    <Typography.Title level={5} variant="h6" color="blue-gray" className="-mb-3">
                                      Логин
                                    </Typography.Title>
                                    <Input
                                        rootClassName="py-3"
                                        prefix={<UserOutlined/>}
                                        size="large"
                                        placeholder="Логин"
                                        value={loginValue}
                                        onChange={(e) => setLogin(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Typography.Title level={5} variant="h6" color="blue-gray" className="-mb-3">
                                      Пароль
                                    </Typography.Title>
                                    <Input.Password
                                        rootClassName="py-3"
                                        prefix={<LockOutlined/>}
                                        size="large"
                                        placeholder="Пароль"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                  </div>
                                  <Checkbox>Мени еслаб қолиш</Checkbox>
                                  <button type='submit'
                                          className='inline-flex h-12 animate-background-shine items-center justify-center rounded-md border border-gray-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'>
                                    Кириш
                                  </button>
                                </div>
                              </Form>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        )}
      </div>
  );
}

export default Login;

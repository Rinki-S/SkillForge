import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../api/http';

const schema = z.object({
  username: z.string().trim().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      navigate('/', { replace: true });
    } catch (error) {
      setError('root', { message: getErrorMessage(error) });
    }
  });

  return (
    <div className="mx-auto grid max-w-4xl gap-5 py-8 lg:grid-cols-[1fr_420px] lg:items-center">
      <div className="hidden rounded-lg border border-console-line bg-console-panel p-6 shadow-soft lg:block">
        <p className="sf-kicker">访问控制台</p>
        <h1 className="mt-2 text-3xl font-semibold text-console-ink">进入提示词运营控制台</h1>
        <p className="mt-3 text-sm leading-6 text-console-muted">登录后可以创建、收藏、生成并追踪团队复用的提示词技能。</p>
      </div>
      <Card>
        <div className="mb-6 space-y-2">
          <p className="sf-kicker">SkillForge</p>
          <CardTitle className="text-xl">登录</CardTitle>
          <p className="text-sm text-console-muted">使用账号进入技能目录与创作台。</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="用户名" autoComplete="username" error={errors.username?.message} {...register('username')} />
          <Input
            label="密码"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {errors.root?.message ? <p className="sf-error">{errors.root.message}</p> : null}
          <Button className="w-full" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? '登录中...' : '登录'}
          </Button>
          <p className="text-center text-sm text-console-muted">
            还没有账号？{' '}
            <Link className="font-semibold text-console-orange hover:text-brand-700" to="/register">
              去注册
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

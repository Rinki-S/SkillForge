import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../api/client';
import { getErrorMessage } from '../api/http';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const schema = z.object({
  username: z.string().trim().min(3, '用户名至少 3 个字符'),
  nickname: z.string().trim().optional(),
  password: z.string().min(6, '密码至少 6 个字符'),
});

type RegisterForm = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });
  const mutation = useMutation({ mutationFn: authApi.register });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ ...values, nickname: values.nickname || values.username });
      navigate('/login', { replace: true });
    } catch (error) {
      setError('root', { message: getErrorMessage(error) });
    }
  });

  return (
    <div className="mx-auto grid max-w-4xl gap-5 py-8 lg:grid-cols-[1fr_420px] lg:items-center">
      <div className="hidden rounded-lg border border-console-line bg-console-panel p-6 shadow-soft lg:block">
        <p className="sf-kicker">新用户</p>
        <h1 className="mt-2 text-3xl font-semibold text-console-ink">创建你的 SkillForge 控制台账号</h1>
        <p className="mt-3 text-sm leading-6 text-console-muted">注册后即可提交技能、等待审核，并把常用提示词沉淀为可复用资源。</p>
      </div>
      <Card>
        <div className="mb-6 space-y-2">
          <p className="sf-kicker">SkillForge</p>
          <CardTitle className="text-xl">注册账号</CardTitle>
          <p className="text-sm text-console-muted">创建账号后即可发布和复用智能技能。</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="用户名" autoComplete="username" error={errors.username?.message} {...register('username')} />
          <Input label="昵称" error={errors.nickname?.message} {...register('nickname')} />
          <Input
            label="密码"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {errors.root?.message ? <p className="sf-error">{errors.root.message}</p> : null}
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? '注册中...' : '注册'}
          </Button>
          <p className="text-center text-sm text-console-muted">
            已有账号？{' '}
            <Link className="font-semibold text-console-orange hover:text-brand-700" to="/login">
              去登录
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

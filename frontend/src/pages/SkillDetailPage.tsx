import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Heart, Play, Star } from 'lucide-react';
import { engagementApi, promptApi, skillApi } from '../api/client';
import { getErrorMessage } from '../api/http';
import { EmptyState, ErrorState, LoadingState } from '../components/states/QueryStates';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { MetaPill, PageHeader, ResourcePanel, ResourceRow, StatusBadge } from '../components/ui/Console';
import { Input, Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { getPageItems, parseOptions, renderPromptPreview, statusLabels } from '../lib/utils';

export function SkillDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState('');
  const [message, setMessage] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const skillQuery = useQuery({ queryKey: ['skill', id], queryFn: () => skillApi.publicDetail(id), enabled: Boolean(id) });
  const variablesQuery = useQuery({
    queryKey: ['skill', id, 'variables'],
    queryFn: () => skillApi.variables(id),
    enabled: Boolean(id),
  });
  const reviewsQuery = useQuery({
    queryKey: ['skill', id, 'reviews'],
    queryFn: () => skillApi.reviews(id, { page: 1, size: 10 }),
    enabled: Boolean(id),
  });
  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: () => engagementApi.favorites({ page: 1, size: 100 }),
    enabled: isAuthenticated,
  });

  const variables = variablesQuery.data ?? [];
  const favorites = useMemo(() => getPageItems(favoritesQuery.data), [favoritesQuery.data]);
  const isFavorited = favorites.some((favorite) => String(favorite.skillId) === String(id));
  const preview = useMemo(
    () => renderPromptPreview(skillQuery.data?.promptTemplate ?? '', values),
    [skillQuery.data?.promptTemplate, values],
  );

  const generateMutation = useMutation({
    mutationFn: () => promptApi.generate(id, values),
    onSuccess: (data) => {
      setGenerated(data.renderedPrompt || data.prompt || '');
      setMessage('生成成功');
      queryClient.invalidateQueries({ queryKey: ['skill', id] });
    },
    onError: (error) => setMessage(getErrorMessage(error)),
  });

  const favoriteMutation = useMutation({
    mutationFn: () => (isFavorited ? engagementApi.unfavorite(id) : engagementApi.favorite(id)),
    onSuccess: async () => {
      setMessage(isFavorited ? '已取消收藏' : '收藏成功');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['favorites'] }),
        queryClient.invalidateQueries({ queryKey: ['skill', id] }),
        queryClient.invalidateQueries({ queryKey: ['marketplace'] }),
      ]);
    },
    onError: async (error) => {
      const errorMessage = getErrorMessage(error);
      setMessage(errorMessage === '已收藏' ? '已收藏' : errorMessage);
      if (errorMessage === '已收藏') {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['favorites'] }),
          queryClient.invalidateQueries({ queryKey: ['skill', id] }),
        ]);
      }
    },
  });

  const reviewMutation = useMutation({
    mutationFn: () => engagementApi.review(id, review),
    onSuccess: () => {
      setMessage('评价成功');
      setReview({ rating: 5, comment: '' });
      queryClient.invalidateQueries({ queryKey: ['skill', id, 'reviews'] });
    },
    onError: (error) => setMessage(getErrorMessage(error)),
  });

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(generated);
    setMessage('已复制到剪贴板');
  };

  if (skillQuery.isLoading) return <LoadingState />;
  if (skillQuery.isError) return <ErrorState error={skillQuery.error} onRetry={() => skillQuery.refetch()} />;
  const skill = skillQuery.data;
  if (!skill) return <EmptyState title="技能不存在" />;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="技能资源"
        title={skill.title}
        description={skill.intro}
        actions={
          <Button
            type="button"
            variant="secondary"
            disabled={favoriteMutation.isPending || (isAuthenticated && favoritesQuery.isLoading)}
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
                return;
              }
              favoriteMutation.mutate();
            }}
          >
            <Heart className={isFavorited ? 'h-4 w-4 fill-console-orange text-console-orange' : 'h-4 w-4'} />
            {favoriteMutation.isPending ? '处理中...' : isFavorited ? '取消收藏' : '收藏'}
          </Button>
        }
        meta={
          <div className="flex flex-wrap gap-2">
            <MetaPill>分类 {skill.categoryName || '未分类'}</MetaPill>
            <MetaPill>模型 <span className="ml-1 font-mono">{skill.modelType || '通用'}</span></MetaPill>
            <MetaPill>作者 {skill.authorName || '-'}</MetaPill>
            <MetaPill>使用量 {skill.usageCount ?? 0}</MetaPill>
            <MetaPill>收藏数 {skill.favoriteCount ?? 0}</MetaPill>
            <span className="inline-flex items-center gap-1 rounded-full border border-console-orange/25 bg-console-orangeSoft px-2.5 py-1 text-xs font-semibold text-brand-700">
              <Star className="h-4 w-4 fill-console-orange text-console-orange" /> {skill.avgRating ?? '-'}
            </span>
            {skill.status ? <StatusBadge status={skill.status}>{statusLabels[skill.status] || skill.status}</StatusBadge> : null}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-5">
          <ResourcePanel>
            <div className="sf-panel-header">
              <p className="sf-kicker">模板</p>
              <CardTitle className="mt-1">提示词模板</CardTitle>
            </div>
            <div className="p-4">
              <pre className="sf-code-surface">{skill.promptTemplate}</pre>
            </div>
          </ResourcePanel>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <p className="sf-kicker">输出约束</p>
              <CardTitle className="mt-1">输出格式</CardTitle>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-console-muted">{skill.outputFormat || '未配置输出格式。'}</p>
            </Card>
            <Card>
              <p className="sf-kicker">使用说明</p>
              <CardTitle className="mt-1">使用示例</CardTitle>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-console-muted">{skill.usageExamples || '暂无使用示例。'}</p>
            </Card>
          </div>

          <ResourcePanel>
            <div className="sf-panel-header">
              <p className="sf-kicker">用户评价</p>
              <CardTitle className="mt-1">评价</CardTitle>
            </div>
            <div className="divide-y divide-console-line">
              {reviewsQuery.data?.records?.length ? (
                reviewsQuery.data.records.map((item) => (
                  <ResourceRow key={item.id} className="space-y-1">
                    <div className="font-medium text-console-ink">{item.username || '用户'} · {item.rating} 星</div>
                    <p className="text-sm text-console-muted">{item.comment || '无评论'}</p>
                  </ResourceRow>
                ))
              ) : (
                <div className="p-4 text-sm text-console-muted">暂无评价</div>
              )}
            </div>
            {isAuthenticated ? (
              <div className="grid gap-3 border-t border-console-line p-4 sm:grid-cols-[120px_1fr_auto]">
                <Input
                  label="评分"
                  type="number"
                  min={1}
                  max={5}
                  value={review.rating}
                  onChange={(event) => setReview((prev) => ({ ...prev, rating: Number(event.target.value) }))}
                />
                <Input
                  label="评论"
                  value={review.comment}
                  onChange={(event) => setReview((prev) => ({ ...prev, comment: event.target.value }))}
                />
                <div className="flex items-end">
                  <Button type="button" onClick={() => reviewMutation.mutate()} disabled={reviewMutation.isPending}>
                    提交评价
                  </Button>
                </div>
              </div>
            ) : null}
          </ResourcePanel>
        </div>

        <aside className="xl:sticky xl:top-20 xl:self-start">
          <ResourcePanel>
            <div className="sf-panel-header">
              <p className="sf-kicker">提示词生成栏</p>
              <CardTitle className="mt-1">提示词生成</CardTitle>
              {!isAuthenticated ? (
                <p className="mt-2 text-sm text-console-muted">
                  <Link className="font-semibold text-console-orange hover:text-brand-700" to="/login">登录</Link> 后可生成并记录使用历史。
                </p>
              ) : null}
            </div>

            <div className="max-h-[calc(100vh-9rem)] space-y-4 overflow-auto p-4">
              <div className="relative pl-7">
                <span className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-console-line" />
                <div className="relative">
                  <span className="absolute -left-[1.6rem] top-1.5 h-3 w-3 rounded-full border-2 border-console-orange bg-console-panel" />
                  <p className="sf-kicker">第 1 步</p>
                  <h3 className="mt-1 text-sm font-semibold text-console-ink">模板已加载</h3>
                  <p className="mt-1 text-xs leading-5 text-console-muted">变量会注入到下方已发布模板中。</p>
                </div>

                <div className="mt-5 space-y-4">
                  {variablesQuery.isLoading ? <LoadingState text="加载变量..." /> : null}
                  {variables.map((variable, index) => {
                    const value = values[variable.name] ?? variable.defaultValue ?? '';
                    const setValue = (next: string) => setValues((prev) => ({ ...prev, [variable.name]: next }));
                    const label = `${variable.label}${variable.required ? ' *' : ''}`;
                    return (
                      <div key={variable.name} className="relative rounded-md border border-console-line bg-white p-3">
                        <span className="absolute -left-[1.65rem] top-4 h-3 w-3 rounded-full border-2 border-console-line bg-console-panel" />
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="font-mono text-xs font-semibold text-console-ink">{`{{${variable.name}}}`}</p>
                          <span className="text-xs text-console-muted">#{index + 1}</span>
                        </div>
                        {variable.type === 'textarea' ? (
                          <Textarea label={label} value={value} onChange={(e) => setValue(e.target.value)} />
                        ) : variable.type === 'select' ? (
                          <Select
                            label={label}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            options={parseOptions(variable.options ?? variable.optionsJson).map((option) => ({ label: option, value: option }))}
                          />
                        ) : (
                          <Input
                            label={label}
                            type={variable.type === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-5 rounded-md border border-console-line bg-console-subtle p-3">
                  <span className="absolute -left-[1.65rem] top-4 h-3 w-3 rounded-full border-2 border-console-orange bg-console-panel" />
                  <p className="sf-kicker">实时预览</p>
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-xs leading-6 text-console-ink">
                    {preview || '暂无模板'}
                  </pre>
                </div>

                <div className="relative mt-5">
                  <span className="absolute -left-[1.6rem] top-3 h-3 w-3 rounded-full border-2 border-console-orange bg-console-orange" />
                  {message ? <p className="mb-3 text-sm font-medium text-console-muted">{message}</p> : null}
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!isAuthenticated || generateMutation.isPending}
                    onClick={() => generateMutation.mutate()}
                  >
                    <Play className="h-4 w-4" /> {generateMutation.isPending ? '生成中...' : '生成提示词'}
                  </Button>
                </div>
              </div>

              {generated ? (
                <div className="rounded-md border border-console-orange/25 bg-console-orangeSoft p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="sf-kicker">后端结果</p>
                      <h3 className="mt-1 text-sm font-semibold text-console-ink">生成结果</h3>
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={copyPrompt}>
                      <Copy className="h-4 w-4" /> 复制
                    </Button>
                  </div>
                  <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-console-code p-4 font-mono text-xs leading-6 text-white">
                    {generated}
                  </pre>
                </div>
              ) : null}
            </div>
          </ResourcePanel>
        </aside>
      </div>
    </div>
  );
}

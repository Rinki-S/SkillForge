import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { skillApi } from '../api/client';
import { getErrorMessage } from '../api/http';
import { SkillForm } from '../components/SkillForm';
import { ErrorState, LoadingState } from '../components/states/QueryStates';
import { PageHeader } from '../components/ui/Console';
import type { SkillFormValues } from '../types/models';

export function SkillEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: skillApi.categories });
  const skillQuery = useQuery({ queryKey: ['skill-edit', id], queryFn: () => skillApi.detail(id), enabled: Boolean(id) });
  const variablesQuery = useQuery({ queryKey: ['skill-edit', id, 'variables'], queryFn: () => skillApi.variables(id), enabled: Boolean(id) });
  const mutation = useMutation({
    mutationFn: (values: SkillFormValues) => skillApi.update(id, values),
    onSuccess: () => navigate('/my-skills'),
  });

  if (skillQuery.isLoading) return <LoadingState />;
  if (skillQuery.isError) return <ErrorState error={skillQuery.error} onRetry={() => skillQuery.refetch()} />;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="创作者工作台"
        title="编辑技能"
        description="已发布技能编辑后会重新进入待审核。"
      />
      <SkillForm
        skill={skillQuery.data ? { ...skillQuery.data, variables: variablesQuery.data ?? skillQuery.data.variables } : undefined}
        categories={categoriesQuery.data ?? []}
        isSubmitting={mutation.isPending}
        onSubmit={async (values) => {
          try {
            await mutation.mutateAsync(values);
          } catch (error) {
            alert(getErrorMessage(error));
          }
        }}
      />
    </div>
  );
}

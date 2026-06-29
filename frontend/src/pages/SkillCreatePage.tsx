import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { skillApi } from '../api/client';
import { getErrorMessage } from '../api/http';
import { SkillForm } from '../components/SkillForm';
import { LoadingState } from '../components/states/QueryStates';
import { PageHeader } from '../components/ui/Console';
import type { SkillFormValues } from '../types/models';

export function SkillCreatePage() {
  const navigate = useNavigate();
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: skillApi.categories });
  const mutation = useMutation({
    mutationFn: (values: SkillFormValues) => skillApi.create(values),
    onSuccess: () => navigate('/my-skills'),
  });

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="创作者工作台"
        title="创建技能"
        description="保存后进入待审核状态，通过后展示到技能目录。"
      />
      {categoriesQuery.isLoading ? <LoadingState /> : null}
      <SkillForm
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

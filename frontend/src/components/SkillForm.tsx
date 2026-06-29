import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import type { Skill, SkillFormValues } from '../types/models';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';
import { Select } from './ui/Select';
import { CardTitle } from './ui/Card';
import { ResourcePanel } from './ui/Console';
import { extractTemplateVariables, modelTypes, parseOptions } from '../lib/utils';

const variableSchema = z.object({
  name: z.string().trim().regex(/^\w+$/, '变量名只能包含字母、数字、下划线'),
  label: z.string().trim().min(1, '请输入展示名'),
  type: z.enum(['text', 'textarea', 'number', 'select']),
  required: z.boolean(),
  defaultValue: z.string().optional(),
  optionsText: z.string().optional(),
  sortOrder: z.number().optional(),
});

const schema = z
  .object({
    title: z.string().trim().min(1, '标题不能为空'),
    intro: z.string().trim().min(1, '简介不能为空'),
    promptTemplate: z.string().trim().min(1, '提示词模板不能为空'),
    outputFormat: z.string().optional(),
    usageExamples: z.string().optional(),
    modelType: z.string().optional(),
    categoryId: z.string().optional(),
    variables: z.array(variableSchema),
  })
  .superRefine((value, ctx) => {
    const placeholders = extractTemplateVariables(value.promptTemplate).sort();
    const variableNames = value.variables.map((item) => item.name).filter(Boolean).sort();
    if (JSON.stringify(placeholders) !== JSON.stringify(variableNames)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['variables'],
        message: `模板变量与配置不匹配：模板包含 ${placeholders.join(', ') || '无'}，配置包含 ${variableNames.join(', ') || '无'}`,
      });
    }
    value.variables.forEach((variable, index) => {
      if (variable.type === 'select' && parseOptions(variable.optionsText).length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['variables', index, 'optionsText'],
          message: '下拉选择类型必须配置选项',
        });
      }
    });
  });

type InternalForm = z.infer<typeof schema>;

function toInternal(skill?: Skill): InternalForm {
  return {
    title: skill?.title ?? '',
    intro: skill?.intro ?? '',
    promptTemplate: skill?.promptTemplate ?? '',
    outputFormat: skill?.outputFormat ?? '',
    usageExamples: skill?.usageExamples ?? skill?.examples ?? '',
    modelType: skill?.modelType ?? '通用',
    categoryId: skill?.categoryId ? String(skill.categoryId) : '',
    variables:
      skill?.variables?.map((variable, index) => ({
        name: variable.name,
        label: variable.label,
        type: variable.type,
        required: variable.required,
        defaultValue: variable.defaultValue ?? '',
        optionsText: parseOptions(variable.options ?? variable.optionsJson).join('\n'),
        sortOrder: variable.sortOrder ?? index,
      })) ?? [],
  };
}

function toPayload(values: InternalForm): SkillFormValues {
  return {
    title: values.title,
    intro: values.intro,
    promptTemplate: values.promptTemplate,
    outputFormat: values.outputFormat,
    usageExamples: values.usageExamples,
    modelType: values.modelType,
    categoryId: values.categoryId ? Number(values.categoryId) : null,
    variables: values.variables.map((variable, index) => ({
      name: variable.name,
      label: variable.label,
      type: variable.type,
      required: variable.required,
      defaultValue: variable.defaultValue,
      options: variable.type === 'select' ? parseOptions(variable.optionsText) : undefined,
      sortOrder: index,
    })),
  };
}

interface SkillFormProps {
  skill?: Skill;
  categories: Array<{ id: number; name: string }>;
  isSubmitting?: boolean;
  onSubmit: (values: SkillFormValues) => Promise<void> | void;
}

export function SkillForm({ skill, categories, isSubmitting, onSubmit }: SkillFormProps) {
  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<InternalForm>({ resolver: zodResolver(schema), defaultValues: toInternal(skill) });
  const variables = useFieldArray({ control, name: 'variables' });
  const promptTemplate = watch('promptTemplate');
  const placeholders = extractTemplateVariables(promptTemplate || '');

  useEffect(() => {
    reset(toInternal(skill));
  }, [reset, skill]);

  const submit = handleSubmit((values) => onSubmit(toPayload(values)));

  return (
    <form className="space-y-6" onSubmit={submit}>
      <ResourcePanel className="space-y-4 p-4">
        <CardTitle>基础信息</CardTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="标题" error={errors.title?.message} {...register('title')} />
          <Select
            label="分类"
            error={errors.categoryId?.message}
            options={categories.map((item) => ({ label: item.name, value: String(item.id) }))}
            {...register('categoryId')}
          />
          <Select
            label="模型类型"
            options={modelTypes.map((item) => ({ label: item, value: item }))}
            {...register('modelType')}
          />
        </div>
        <Textarea label="简介" error={errors.intro?.message} {...register('intro')} />
        <Textarea label="提示词模板" error={errors.promptTemplate?.message} {...register('promptTemplate')} />
        <p className="text-sm text-console-muted">识别到变量：{placeholders.join(', ') || '无'}</p>
        <Textarea label="输出格式" {...register('outputFormat')} />
        <Textarea label="使用示例" {...register('usageExamples')} />
      </ResourcePanel>

      <ResourcePanel className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>变量配置</CardTitle>
            <p className="mt-1 text-sm text-console-muted">变量名必须与模板中的 {'{{name}}'} 占位一一对应。</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              variables.append({ name: '', label: '', type: 'text', required: true, defaultValue: '', optionsText: '' })
            }
          >
            <Plus className="h-4 w-4" /> 添加变量
          </Button>
        </div>
        {errors.variables?.message ? <p className="sf-error">{errors.variables.message}</p> : null}
        <div className="space-y-4">
          {variables.fields.map((field, index) => (
            <div key={field.id} className="rounded-md border border-console-line bg-white p-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_140px_110px_auto]">
                <Input label="变量名" error={errors.variables?.[index]?.name?.message} {...register(`variables.${index}.name`)} />
                <Input label="展示名" error={errors.variables?.[index]?.label?.message} {...register(`variables.${index}.label`)} />
                <Select
                  label="类型"
                  options={[
                    { label: '单行文本', value: 'text' },
                    { label: '多行文本', value: 'textarea' },
                    { label: '数字', value: 'number' },
                    { label: '下拉选择', value: 'select' },
                  ]}
                  {...register(`variables.${index}.type`)}
                />
                <label className="flex items-end gap-2 pb-2 text-sm text-console-muted">
                  <input type="checkbox" className="h-4 w-4 rounded border-console-line accent-console-orange" {...register(`variables.${index}.required`)} />
                  必填
                </label>
                <div className="flex items-end">
                  <Button type="button" variant="danger" size="sm" onClick={() => variables.remove(index)}>
                    <Trash2 className="h-4 w-4" /> 删除
                  </Button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Input label="默认值" {...register(`variables.${index}.defaultValue`)} />
                <Textarea
                  label="选项（下拉选择用，逗号或换行分隔）"
                  error={errors.variables?.[index]?.optionsText?.message}
                  {...register(`variables.${index}.optionsText`)}
                />
              </div>
            </div>
          ))}
          {variables.fields.length === 0 ? <p className="text-sm text-console-muted">暂无变量。若模板包含占位符，请添加对应变量。</p> : null}
        </div>
      </ResourcePanel>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存并提交审核'}
        </Button>
      </div>
    </form>
  );
}

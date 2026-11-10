'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ReactNode, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isApiError } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field, Input, Textarea } from '@/shared/ui/field';
import { Select } from '@/shared/ui/select';
import { TagGroup } from '@/shared/ui/tag-group';
import { INDUSTRIES, INTEREST_TAGS, mapProfileDto, myProfileQuery, profileKeys, type Profile } from '@/entities/profile';
import { viewerKeys } from '@/entities/viewer';
import { updateMyProfile } from '../api/update-profile';
import { applyFieldErrors } from '../lib/field-errors';
import { useUnsavedChangesGuard } from '../lib/unsaved-guard';
import { editProfileCopy } from '../model/content';
import { emptyProfileForm, profileFormSchema, type ProfileFormValues } from '../model/schema';

function toFormValues(profile: Profile): ProfileFormValues {
  return {
    fullName: profile.fullName,
    company: profile.company,
    role: profile.role,
    industry: profile.industry,
    city: profile.city,
    website: profile.website,
    lookingFor: profile.lookingFor,
    offering: profile.offering,
    tags: profile.tags,
    catalogConsent: profile.catalogConsent,
    publishConsent: profile.publishConsent,
  };
}

export function ProfileForm({ footer }: { footer?: ReactNode }) {
  const queryClient = useQueryClient();
  const profileQuery = useQuery(myProfileQuery());
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: emptyProfileForm,
  });
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    if (profileQuery.data) {
      reset(toFormValues(profileQuery.data));
    }
  }, [profileQuery.data, reset]);

  useUnsavedChangesGuard(isDirty, editProfileCopy.unsaved);

  const saveMutation = useMutation({
    mutationFn: (values: ProfileFormValues) => updateMyProfile(values),
    onSuccess: (dto) => {
      const profile = mapProfileDto(dto);
      queryClient.setQueryData(profileKeys.me(), profile);
      void queryClient.invalidateQueries({ queryKey: viewerKeys.all });
      reset(toFormValues(profile));
      toast.success(profile.status === 'pending' ? editProfileCopy.pending : editProfileCopy.saved);
    },
    onError: (error) => {
      applyFieldErrors(error, setError);
      if (isApiError(error) && !error.fieldErrors) {
        toast.error(error.message);
      }
    },
  });

  const canSubmit = profileFormSchema.safeParse(watch()).success;
  const serverError = saveMutation.error && isApiError(saveMutation.error) && !saveMutation.error.fieldErrors
    ? saveMutation.error.message
    : undefined;

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit((values) => saveMutation.mutate(values))} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="fullName" label={editProfileCopy.fullName} error={errors.fullName?.message ?? ''}>
          <Input id="fullName" invalid={Boolean(errors.fullName)} autoComplete="name" {...register('fullName')} />
        </Field>
        <Field id="company" label={editProfileCopy.company} error={errors.company?.message ?? ''}>
          <Input id="company" invalid={Boolean(errors.company)} autoComplete="organization" {...register('company')} />
        </Field>
        <Field id="role" label={editProfileCopy.role} error={errors.role?.message ?? ''}>
          <Input id="role" invalid={Boolean(errors.role)} autoComplete="organization-title" {...register('role')} />
        </Field>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <Field id="industry" label={editProfileCopy.industry} error={errors.industry?.message ?? ''}>
              <Select
                id="industry"
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                invalid={Boolean(errors.industry)}
                placeholder="Маркетинг и PR"
              >
                {INDUSTRIES.map((item) => (
                  <Select.Item key={item} value={item}>
                    {item}
                  </Select.Item>
                ))}
              </Select>
            </Field>
          )}
        />
        <Field id="city" label={editProfileCopy.city} error={errors.city?.message ?? ''}>
          <Input id="city" autoComplete="address-level2" {...register('city')} />
        </Field>
        <Field id="website" label={editProfileCopy.website} error={errors.website?.message ?? ''}>
          <Input
            id="website"
            type="url"
            inputMode="url"
            placeholder={editProfileCopy.websitePlaceholder}
            invalid={Boolean(errors.website)}
            {...register('website')}
          />
        </Field>
      </div>
      <Controller
        name="lookingFor"
        control={control}
        render={({ field }) => (
          <Field id="lookingFor" label={editProfileCopy.lookingFor} error={errors.lookingFor?.message ?? ''}>
            <Textarea id="lookingFor" invalid={Boolean(errors.lookingFor)} {...field} />
          </Field>
        )}
      />
      <Controller
        name="offering"
        control={control}
        render={({ field }) => (
          <Field id="offering" label={editProfileCopy.offering} error={errors.offering?.message ?? ''}>
            <Textarea id="offering" invalid={Boolean(errors.offering)} {...field} />
          </Field>
        )}
      />
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <Field id="tags" label={editProfileCopy.tags} error={errors.tags?.message ?? ''}>
            <TagGroup options={INTEREST_TAGS} value={field.value} onChange={field.onChange} max={8} />
          </Field>
        )}
      />
      <Controller
        name="catalogConsent"
        control={control}
        render={({ field }) => (
          <Checkbox
            id="catalogConsent"
            name={field.name}
            checked={field.value}
            onCheckedChange={(value) => field.onChange(value === true)}
            onBlur={field.onBlur}
            label={editProfileCopy.catalogConsent}
          />
        )}
      />
      <Controller
        name="publishConsent"
        control={control}
        render={({ field }) => (
          <Checkbox
            id="publishConsent"
            name={field.name}
            checked={field.value}
            onCheckedChange={(value) => field.onChange(value === true)}
            onBlur={field.onBlur}
            label={editProfileCopy.publishConsent}
          />
        )}
      />
      <p className="text-xs text-text-muted">{editProfileCopy.moderationNote}</p>
      {serverError ? (
        <p className="text-sm text-danger" role="alert">
          {serverError}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" loading={saveMutation.isPending} disabled={!canSubmit || saveMutation.isPending}>
          {editProfileCopy.save}
        </Button>
        {footer}
      </div>
    </form>
  );
}

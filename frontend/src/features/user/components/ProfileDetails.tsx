'use client';
import { useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateProfileRequest, User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const profileFieldConfig : readonly {
  key: keyof User;
  label: string;
  editable: boolean;
}[] = [
  { key: 'fullName', label: 'Full Name', editable: true },
  { key: 'email', label: 'Email', editable: false },
  { key: 'phoneNum', label: 'Phone', editable: true },
] as const;

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-muted-foreground text-sm font-medium">{label}</h3>
      <p className="text-lg font-semibold">{value || 'Chưa cập nhật'}</p>
    </div>
  );
}

function ProfileInfoView({ data }: { data: User }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {profileFieldConfig.map((field) => (
        <ProfileField
          key={field.key}
          label={field.label}
          value={data[field.key] || ''}
        />
      ))}
    </div>
  );
}

function ProfileEditForm({
  initialData,
  onCancel,
  onSave,
}: {
  initialData: User;
  onCancel: () => void;
  onSave: (data: UpdateProfileRequest) => void;
}) {
  const [form, setForm] = useState<User>(initialData);

  const handleChange = (key: keyof User, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // chỉ gửi field editable
    const payload: UpdateProfileRequest = {
      fullName: form.fullName,
      phoneNum: form.phoneNum,
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {profileFieldConfig.map((field) => (
          <div key={field.key}>
            <p className="text-muted-foreground text-sm">{field.label}</p>

            <Input
              value={form[field.key] || ''}
              disabled={!field.editable}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />

            {!field.editable && (
              <p className="text-muted-foreground mt-1 text-xs">
                Cannot be changed
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export function ProfileDetails() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { profile, updateProfile } = useProfile();
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!profile) return <Skeleton className="h-48 w-full" />;

  const handleSave = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Basic Information</CardTitle>

        {!isEditing && (
          <Button size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <ProfileEditForm
            initialData={profile}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        ) : (
          <ProfileInfoView data={profile} />
        )}

        {errorMessage && (
          <p className="text-destructive mt-2 text-sm">{errorMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}

'use client'
import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateProfileRequest, User } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

const PROFILE_FIELDS: readonly {
  key: keyof User
  label: string
  editable: boolean
}[] = [
  { key: 'fullName', label: 'Họ và tên', editable: true },
  { key: 'phoneNum', label: 'Số điện thoại', editable: true },
  { key: 'email', label: 'Email', editable: false },
] as const

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/70 rounded-lg border p-4">
      <h3 className="text-muted-foreground mb-5 text-xs font-medium tracking-wide uppercase">
        {label}
      </h3>
      <p className="text-sm font-semibold md:text-lg">
        {value || 'Chưa cập nhật'}
      </p>
    </div>
  )
}

function ProfileInfoView({ data }: { data: User }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {PROFILE_FIELDS.map((field) => (
        <ProfileField
          key={field.key}
          label={field.label}
          value={data[field.key] || ''}
        />
      ))}
    </div>
  )
}

function ProfileEditForm({
  initialData,
  onCancel,
  onSave,
}: {
  initialData: User
  onCancel: () => void
  onSave: (data: UpdateProfileRequest) => void
}) {
  const [form, setForm] = useState<User>(initialData)

  const handleChange = (key: keyof User, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    setForm(initialData)
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // chỉ gửi field editable
    const payload: UpdateProfileRequest = {
      fullName: form.fullName,
      phoneNum: form.phoneNum,
    }

    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {PROFILE_FIELDS.map((field) => (
          <div
            key={field.key}
            className="bg-background space-y-2 rounded-lg border p-4"
          >
            <p className="text-muted-foreground mb-5 text-xs font-medium tracking-wide uppercase">
              {field.label}
            </p>

            <Input
              value={form[field.key] || ''}
              disabled={!field.editable}
              className="h-10 text-sm font-semibold md:text-lg"
              onChange={(e) => handleChange(field.key, e.target.value)}
            />

            {!field.editable && (
              <p className="text-muted-foreground text-xs">Cannot be changed</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="font-display h-14 rounded-full px-8 text-[11px] font-black tracking-[0.2em] uppercase transition-all hover:scale-[1.05] active:scale-95"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="font-display h-14 rounded-full bg-slate-900 px-8 text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-[1.05] active:scale-95"
        >
          Lưu
        </Button>
      </div>
    </form>
  )
}

export function ProfileDetails() {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { profile, updateProfile } = useProfile()
  const [errorMessage, setErrorMessage] = useState<string>('')

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  const handleSave = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data)
      setIsEditing(false)
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 space-y-10 duration-700">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-6 rounded-full bg-blue-600" />
            <h2 className="font-display text-2xl font-black tracking-tight text-slate-900">
              Thông tin cá nhân
            </h2>
          </div>
          <p className="mt-1 font-medium text-slate-500">
            Quản lý thông tin cá nhân và liên hệ của bạn.
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="font-display h-14 rounded-full bg-slate-900 px-8 text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-[1.05] active:scale-95"
          >
            Chỉnh sửa
          </Button>
        )}{' '}
      </div>
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
        <p className="text-destructive border-destructive/30 bg-destructive/10 mt-4 rounded-md border px-3 py-2 text-sm">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

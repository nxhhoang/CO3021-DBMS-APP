'use client'
import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { Button } from '@/components/ui/button'
import { UpdateProfileRequest, User } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertCircle, MapPin, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useAddresses } from '@/features/addresses'
import Link from 'next/link'

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
    <div className="h-[88px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </h3>
      <p className="font-display text-base font-black tracking-tight text-slate-900 dark:text-white md:text-lg">
        {value || 'Chưa cập nhật'}
      </p>
    </div>
  )
}

function DefaultAddressSection({ isEditing }: { isEditing?: boolean }) {
  const { addresses, isLoading } = useAddresses()
  const defaultAddress = addresses.find((a) => a.isDefault)

  return (
    <div
      className={cn(
        'animate-in fade-in h-fit duration-300',
        isEditing ? 'opacity-40 grayscale-[0.5]' : 'slide-in-from-right-4',
      )}
    >
      <div className="flex h-[296px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10">
              <MapPin size={16} strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-sm font-black tracking-tight text-slate-900 dark:text-white">
              Địa chỉ mặc định
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : defaultAddress ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="font-display text-base font-black tracking-tight text-slate-900 dark:text-white">
                  {defaultAddress.addressName}
                </p>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-800/30">
                  <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {defaultAddress.addressLine}, {defaultAddress.district},{' '}
                    {defaultAddress.city}
                  </p>
                </div>
              </div>

              <div className="h-10">
                {!isEditing && (
                  <Button
                    variant="outline"
                    className="group h-10 w-full rounded-xl border-slate-200 font-display text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-blue-600 hover:text-white dark:border-slate-800"
                    asChild
                  >
                    <Link href="/user/addresses">
                      Thay đổi địa chỉ
                      <ArrowRight
                        size={12}
                        className="ml-2 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 pt-4 text-center">
              <p className="text-xs font-medium text-slate-400">
                Bạn chưa thiết lập địa chỉ mặc định.
              </p>
              <div className="h-9">
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg border-slate-200 font-display text-[10px] font-black tracking-widest uppercase"
                    asChild
                  >
                    <Link href="/user/addresses">Thiết lập ngay</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-[10px] font-medium leading-relaxed text-slate-400">
            {isEditing
              ? 'Vui lòng hoàn tất chỉnh sửa hồ sơ để thay đổi địa chỉ.'
              : 'Địa chỉ này sẽ được ưu tiên sử dụng khi bạn đặt hàng nhanh.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfileInfoView({
  data,
  onEdit,
}: {
  data: User
  onEdit: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex h-9 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-4 rounded-full bg-slate-900" />
          <h4 className="font-display text-[13px] font-black tracking-tight text-slate-900 uppercase">
            Hồ sơ cá nhân
          </h4>
        </div>
        <Button
          onClick={onEdit}
          variant="outline"
          className="h-9 rounded-xl border-slate-200 bg-white px-5 font-display text-[10px] font-black tracking-widest text-slate-900 uppercase transition-all hover:bg-slate-900 hover:text-white active:scale-95"
        >
          Chỉnh sửa hồ sơ
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PROFILE_FIELDS.map((field) => (
          <ProfileField
            key={field.key}
            label={field.label}
            value={data[field.key] || ''}
          />
        ))}
      </div>
    </div>
  )
}

function ProfileEditForm({
  initialData,
  onCancel,
  onSave,
  isLoading,
}: {
  initialData: User
  onCancel: () => void
  onSave: (data: UpdateProfileRequest) => Promise<void>
  isLoading: boolean
}) {
  const [form, setForm] = useState<User>(initialData)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const validateField = (key: string, value: string) => {
    if (key === 'fullName') {
      if (!value.trim()) return 'Họ và tên không được để trống'
      if (value.length > 100) return 'Họ và tên không được quá 100 ký tự'
    }
    if (key === 'phoneNum') {
      if (!value.trim()) return 'Số điện thoại không được để trống'
      if (!/^[0-9]{9,15}$/.test(value)) return 'Số điện thoại không hợp lệ (9-15 chữ số)'
    }
    return ''
  }

  const handleChange = (key: keyof User, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    const error = validateField(key as string, value)
    setFieldErrors((prev) => ({ ...prev, [key]: error }))
  }

  useEffect(() => {
    setForm(initialData)
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    PROFILE_FIELDS.forEach((field) => {
      if (field.editable) {
        const error = validateField(field.key as string, form[field.key] || '')
        if (error) newErrors[field.key] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      return
    }

    try {
      await onSave({
        fullName: form.fullName,
        phoneNum: form.phoneNum,
      })
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors
        const formattedErrors: Record<string, string> = {}
        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key].msg
        })
        setFieldErrors(formattedErrors)
      }
    }
  }

  const handleCancelClick = () => {
    const hasChanges =
      form.fullName !== initialData.fullName ||
      form.phoneNum !== initialData.phoneNum

    if (hasChanges) {
      setShowCancelDialog(true)
    } else {
      onCancel()
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex h-9 items-center gap-3">
          <div className="h-1.5 w-4 rounded-full bg-blue-600" />
          <h4 className="font-display text-[13px] font-black tracking-tight text-blue-600 uppercase">
            Đang chỉnh sửa
          </h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {PROFILE_FIELDS.map((field) => (
              <div key={field.key} className="h-[88px]">
                {field.editable ? (
                  <div
                    className={cn(
                      'group h-full rounded-xl border p-5 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10',
                      fieldErrors[field.key]
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900',
                    )}
                  >
                    <label className="mb-1 block font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      {field.label}
                      {fieldErrors[field.key] && (
                        <span className="ml-2 normal-case text-rose-500">
                          - {fieldErrors[field.key]}
                        </span>
                      )}
                    </label>
                    <input
                      value={form[field.key] || ''}
                      disabled={isLoading}
                      className="w-full bg-transparent font-display text-base font-black tracking-tight text-slate-900 outline-none placeholder:text-slate-300 dark:text-white md:text-lg"
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="h-full rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                    <h3 className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      {field.label}
                    </h3>
                    <p className="font-display text-base font-black tracking-tight text-slate-400 dark:text-slate-500 md:text-lg">
                      {initialData[field.key] || ''}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelClick}
              disabled={isLoading}
              className="font-display h-12 rounded-xl px-8 text-[11px] font-black tracking-widest text-slate-400 uppercase transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="font-display h-12 rounded-xl bg-slate-900 px-10 text-[11px] font-black tracking-widest text-white uppercase transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="rounded-2xl border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Hủy chỉnh sửa?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              Bạn có các thay đổi chưa được lưu. Bạn có chắc chắn muốn hủy không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="font-display h-11 rounded-xl border-slate-200 bg-white text-[10px] font-black tracking-widest uppercase transition-all hover:bg-slate-50">
              Tiếp tục sửa
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onCancel}
              className="font-display h-11 rounded-xl bg-rose-600 text-[10px] font-black tracking-widest text-white uppercase hover:bg-rose-700"
            >
              Hủy thay đổi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function ProfileDetails() {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { profile, updateProfile } = useProfile()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  if (!profile) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
        <div className="hidden lg:block">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  const handleSave = async (data: UpdateProfileRequest) => {
    try {
      setIsLoading(true)
      setErrorMessage('')
      await updateProfile(data)
      setIsEditing(false)
      setShowSuccessDialog(true)
    } catch (error: any) {
      setErrorMessage(error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isEditing ? (
            <ProfileEditForm
              initialData={profile}
              onCancel={() => setIsEditing(false)}
              onSave={handleSave}
              isLoading={isLoading}
            />
          ) : (
            <ProfileInfoView data={profile} onEdit={() => setIsEditing(true)} />
          )}

          {errorMessage && (
            <div className="animate-in slide-in-from-top-2 mt-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-sm font-semibold text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/5">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}
        </div>

        <div className="hidden pt-[60px] lg:block">
          <DefaultAddressSection isEditing={isEditing} />
        </div>
      </div>
    </div>
  )
}

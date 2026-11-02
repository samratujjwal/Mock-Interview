import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import { useSearchParams } from 'react-router-dom';

const schema = z.object({
  token: z.string().min(1),
  id: z.string().min(1),
  newPassword: z.string().min(8),
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const defaultValues = {
    token: searchParams.get('token') || '',
    id: searchParams.get('id') || '',
    newPassword: '',
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/reset-password', data);
      alert(res.data.message || 'Password reset');
      // TODO: redirect to login
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Reset failed';
      alert(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-4">Reset password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('token')} />
        <input type="hidden" {...register('id')} />
        <div>
          <label className="block mb-1">New password</label>
          <input type="password" className="input" {...register('newPassword')} />
          {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
        </div>
        <div>
          <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Resetting...' : 'Reset password'}</button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import { setAuthHeader } from '../../utils/authHeader';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/signup', data);
      const user = res.data?.data?.user || res.data?.user || null;
      const accessToken = res.data?.data?.accessToken || res.data?.accessToken || null;
      alert(res.data.message || 'Signed up');
      if (user && accessToken) {
        useAuthStore.getState().setUser(user, accessToken);
        setAuthHeader(accessToken);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Signup failed';
      alert(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input className="input" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input className="input" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" className="input" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing...' : 'Sign up'}</button>
        </div>
      </form>
    </div>
  );
}

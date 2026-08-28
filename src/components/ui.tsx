import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useToastStore, type ToastType } from '@/stores/toastStore';

export function Button({ className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }): JSX.Element {
  const styles = { primary: 'bg-primary-600 text-white shadow-sm shadow-primary-200 hover:bg-primary-700', secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700', ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800', danger: 'bg-error-50 text-error-700 hover:bg-error-100 dark:bg-error-950/30 dark:text-error-300' };
  return <button className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props} />;
}

export function Input({ label, hint, error, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }): JSX.Element {
  return <label className="block space-y-2"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span><input className={`focus-ring w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 ${error ? 'border-error-400' : 'border-slate-200 hover:border-slate-300'} dark:border-slate-700 dark:bg-slate-900 dark:text-white ${className}`} {...props} />{error ? <span className="text-xs text-error-600">{error}</span> : hint ? <span className="text-xs text-slate-400">{hint}</span> : null}</label>;
}

export function Select({ label, options, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }): JSX.Element {
  return <label className="block space-y-2"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span><select className={`focus-ring w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${className}`} {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export function Modal({ title, children, onClose, actions }: { title: string; children: ReactNode; onClose: () => void; actions?: ReactNode }): JSX.Element {
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="animate-slide-up w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800"><h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h2><button className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose} aria-label="Close"><X size={18} /></button></div><div className="p-6">{children}</div>{actions ? <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">{actions}</div> : null}</div></div>;
}

export function ToastViewport(): JSX.Element {
  const { toasts, removeToast } = useToastStore();
  const icons: Record<ToastType, ReactNode> = { success: <CheckCircle2 size={18} className="text-success-600" />, error: <AlertCircle size={18} className="text-error-600" />, info: <Info size={18} className="text-primary-600" /> };
  return <div className="fixed bottom-5 right-5 z-[70] flex w-[calc(100%-40px)] max-w-sm flex-col gap-3">{toasts.map((toast) => <div key={toast.id} className="animate-slide-up flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">{icons[toast.type]}<span className="flex-1">{toast.message}</span><button onClick={() => removeToast(toast.id)} aria-label="Dismiss"><X size={15} className="text-slate-400" /></button></div>)}</div>;
}

export function Skeleton({ className = '' }: { className?: string }): JSX.Element { return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />; }

export function Avatar({ initials, size = 'md', className = '' }: { initials: string; size?: 'sm' | 'md' | 'lg'; className?: string }): JSX.Element { const sizes = { sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-11 w-11 text-sm' }; return <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-200 ${sizes[size]} ${className}`}>{initials}</div>; }

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { Layout } from '@/components/Layout';
import { Skeleton } from '@/components/ui';

const Login = lazy(() => import('@/pages/Login').then((module) => ({ default: module.Login })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Board = lazy(() => import('@/pages/Board').then((module) => ({ default: module.Board })));
const Analytics = lazy(() => import('@/pages/Analytics').then((module) => ({ default: module.Analytics })));

function ProtectedRoute(): JSX.Element { const { user, isLoading } = useAuthStore(); if (isLoading) return <LoadingScreen />; return user ? <Layout /> : <Navigate to="/login" replace />; }
function LoadingScreen(): JSX.Element { return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] dark:bg-[#111522]"><div className="w-64 space-y-3"><Skeleton className="mx-auto h-12 w-12 rounded-2xl" /><Skeleton className="h-4 w-full" /><Skeleton className="mx-auto h-3 w-2/3" /></div></div>; }

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

export default function App(): JSX.Element { const initialize = useAuthStore((state) => state.initialize); useEffect(() => { initialize(); }, [initialize]); return <QueryClientProvider client={queryClient}><BrowserRouter><Suspense fallback={<LoadingScreen />}><Routes><Route path="/login" element={<Login />} /><Route element={<ProtectedRoute />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/board" element={<Board />} /><Route path="/analytics" element={<Analytics />} /></Route><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></Suspense></BrowserRouter></QueryClientProvider>; }

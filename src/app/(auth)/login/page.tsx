'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            // Login via context
            login(data, data.token); // Assuming API returns user object and token at top level or adjust as needed.
            // API likely returns { ...user, token } based on typical controller structure, or { user, token }. 
            // Let's assume standard response based on previous controller files: res.json({ _id, name, email, token })

            router.push('/profile');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                <div className="text-center">
                    <Link href="/" className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">Resaleo</Link>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
                </div>

                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-white text-gray-900"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-white text-gray-900"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-900">Remember me</label>
                        </div>
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

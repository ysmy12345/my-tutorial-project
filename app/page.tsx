"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AuthPage } from '../components/auth/AuthPage';

import { Storage } from '../utils/storage';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = Storage.getToken();
    if (token) {
      router.replace("/home"); // Redirect to home page if token exists
    }
  }, []);

  return (
    <>
      <AuthPage />
    </>
  );
}

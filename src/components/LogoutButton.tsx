// ~/components/LogoutButton.tsx
'use client';

import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/logout', {
      method: 'GET',
    });

    if (res.ok) {
      router.push('/login'); // Redirect to login page after successful logout
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <Button
        onClick={handleLogout}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        Logout
      </Button>
    </div>
  );
}

import { redirect } from 'next/navigation';
import { Metadata } from 'next';

import { UserNameForm } from '@/components/UserNameForm';
import { authOptions, getAuthSession } from '@/lib/auth';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'Settings | Unwind',
  description: 'manage account settings',
};

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid items-start gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>

        <div className="grid gap-10">
          <UserNameForm
            user={{
              id: session.user.id,
              username: session.user.username || '',
            }}
          />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}

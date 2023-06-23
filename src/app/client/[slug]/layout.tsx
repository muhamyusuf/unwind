import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import ToFeedButton from '@/components/ToFeedButton';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Unwind',
  description: 'Best place to unwind urself from the stress of life',
};

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
  isSubscribed: boolean;
}) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="h-full pt-12 mx-auto sm:container max-w-7xl">
      <div>
        <ToFeedButton />

        <div className="grid grid-cols-1 py-6 md:grid-cols-3 gap-y-4 md:gap-x-4">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          {/* info sidebar */}
          <div className="order-first overflow-hidden border border-gray-200 rounded-lg h-fit">
            <div className="px-6 py-4">
              <p className="py-3 font-semibold capitalize">
                Info {subreddit.name} Community
              </p>
            </div>
            <dl className="px-6 py-4 text-sm leading-6 bg-white divide-y divide-gray-100 dark:bg-slate-900">
              <div className="flex justify-between py-3 gap-x-4">
                <dt className="text-gray-500 dark:text-zinc-50">Created</dt>
                <dd className="text-gray-700 dark:text-zinc-50">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, 'MMMM d, yyyy')}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between py-3 gap-x-4">
                <dt className="text-gray-500 dark:text-zinc-50">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900 dark:text-zinc-50">
                    {memberCount}
                  </div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user?.id ? (
                <div className="flex justify-between py-3 gap-x-4">
                  <dt className="text-gray-500 dark:text-zinc-50">
                    You created this community
                  </dt>
                </div>
              ) : null}

              {subreddit.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}

              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full mb-6',
                })}
                href={`client/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

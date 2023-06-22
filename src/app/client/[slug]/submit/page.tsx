import { Editor } from '@/components/Editor';
import { Button, buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface pageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!subreddit) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="pb-5 border-b border-gray-200">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h3 className="mt-2 ml-2 text-base font-semibold leading-6 text-gray-900">
            Create post in <span className="capitalize">{subreddit.name}</span>{' '}
            Community
          </h3>
        </div>
      </div>

      {/* form */}
      <Editor subredditId={subreddit.id} />

      <div className="flex justify-end w-full">
        {session ? (
          <Button type="submit" className="w-full" form="subreddit-post-form">
            Post
          </Button>
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({
              className: 'w-full',
            })}
          >
            You must be logged in
          </Link>
        )}
      </div>
    </div>
  );
};

export default page;

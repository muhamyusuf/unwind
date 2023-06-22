'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { buttonVariants } from './ui/Button';

const ToFeedButton = () => {
  const pathname = usePathname();

  const subredditPath = getSubredditPath(pathname);

  return (
    <a href={subredditPath} className={buttonVariants({ variant: 'ghost' })}>
      <ChevronLeft className="w-4 h-4 mr-1" />
      {subredditPath === '/' ? 'Back home' : 'Back to community'}
    </a>
  );
};

const getSubredditPath = (pathname: string) => {
  const splitPath = pathname.split('/');

  if (splitPath.length === 3) return '/';
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`;
  // default path, in case pathname does not match expected format
  else return '/';
};

export default ToFeedButton;

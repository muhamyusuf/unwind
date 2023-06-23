'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/hooks/use-toast';
import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { CreateSubredditPayload } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>('');
  const { loginToast } = useCustomToasts();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post('/api/subreddit', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Name already exists.',
            description: 'Please choose a different name.',
            variant: 'destructive',
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: 'Invalid subreddit name.',
            description: 'Please choose a name between 3 and 21 letters.',
            variant: 'destructive',
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: 'There was an error.',
        description: 'Could not create subreddit.',
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      router.push(`/client/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative w-full p-4 space-y-6 rounded-lg bg-white border-gray-200 border dark:border-slate-800 dark:bg-[#030711] h-fit">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="h-px bg-red-500" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitalization cannot be changed. Use (-)
            to replace space.
          </p>
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={isLoading}
            variant="subtle"
            className="dark:bg-[#030711] dark:text-white"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;

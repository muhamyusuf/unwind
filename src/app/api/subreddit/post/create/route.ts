import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { subredditId, title, content } = PostValidator.parse(body);

    // check if user has already subscribed to subreddit
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response('Subsribe to post', {
        status: 400,
      });
    }

    // create subreddit and associate it with the user
    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new Response('post created');
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response('invalid POST request data passed', { status: 422 });
    }

    return new Response(
      'Could not create post at this time. Please try again later',
      { status: 500 }
    );
  }
}

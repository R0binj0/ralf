import { BlogPost } from '../services/blogService';
import Link from 'next/link';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <Link href={`/blog/${post.id}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4">{post.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
        <span>Updated: {new Date(post.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
} 
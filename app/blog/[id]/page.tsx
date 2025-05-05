'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { BlogPost, Comment } from '@/app/services/blogService';
import { getBlogPost, getComments } from '@/app/services/blogService';
import CommentSection from '../../components/CommentSection';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    try {
      const postData = await getBlogPost(String(id));
      setPost(postData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Failed to load post');
      setLoading(false);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    try {
      const commentsData = await getComments(String(id));
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments');
    }
  }, [id]);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [loadPost, loadComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // TODO: Implement comment creation
      console.log('Comment to be created:', newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('Failed to add comment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </article>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border p-4 rounded">
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted on {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <CommentSection
        postId={post.id}
        comments={comments}
        onCommentAdded={(comment) => setComments([...comments, comment])}
        onCommentDeleted={(commentId) =>
          setComments(comments.filter((c) => c.id !== commentId))
        }
      />
    </div>
  );
} 
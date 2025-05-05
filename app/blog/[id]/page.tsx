'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BlogPost, getBlogPost, updateBlogPost, deleteBlogPost } from '../../services/blogService';
import { Comment, getComments } from '../../services/blogService';
import CommentSection from '../../components/CommentSection';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '' });

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = async () => {
    if (typeof id === 'string') {
      const fetchedPost = await getBlogPost(id);
      if (fetchedPost) {
        setPost(fetchedPost);
        setEditData({
          title: fetchedPost.title,
          description: fetchedPost.description,
        });
      }
    }
  };

  const loadComments = async () => {
    if (typeof id === 'string') {
      const fetchedComments = await getComments(id);
      setComments(fetchedComments);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !editData.title.trim() || !editData.description.trim()) return;

    const updatedPost = await updateBlogPost(post.id, editData.title, editData.description);
    if (updatedPost) {
      setPost(updatedPost);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    const success = await deleteBlogPost(post.id);
    if (success) {
      window.location.href = '/blog';
    }
  };

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              required
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <p className="text-gray-600">{post.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <p>Created: {new Date(post.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(post.updated_at).toLocaleString()}</p>
          </div>
        </div>
      )}

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
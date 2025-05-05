'use client';

import { useState, useEffect } from 'react';
import { BlogPost, getBlogPosts, createBlogPost } from '../services/blogService';
import BlogPostCard from '../components/BlogPostCard';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState({ title: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const fetchedPosts = await getBlogPosts();
    setPosts(fetchedPosts);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const createdPost = await createBlogPost(newPost.title, newPost.description);
      
      // Check if the post already exists in the state
      const postExists = posts.some(post => 
        post.title === createdPost.title && 
        post.description === createdPost.description
      );

      if (!postExists) {
        setPosts(prevPosts => [createdPost, ...prevPosts]);
      }
      
      setNewPost({ title: '', description: '' });
      setIsCreating(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isCreating ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Post title"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              required
              disabled={isSubmitting}
            />
            <textarea
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              placeholder="Post description"
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
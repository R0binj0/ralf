import { useState } from 'react';
import { Comment, addComment, deleteComment } from '../services/blogService';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
}

export default function CommentSection({
  postId,
  comments,
  onCommentAdded,
  onCommentDeleted,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    const comment = await addComment(postId, newComment, author);
    onCommentAdded(comment);
    setNewComment('');
  };

  const handleDelete = async (commentId: string) => {
    const success = await deleteComment(commentId);
    if (success) {
      onCommentDeleted(commentId);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            required
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{comment.author}</p>
                <p className="text-gray-600">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
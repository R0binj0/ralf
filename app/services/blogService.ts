export interface BlogPost {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  author: string;
}

// In-memory storage for blog posts and comments
let blogPosts: BlogPost[] = [];
let comments: Comment[] = [];

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  return blogPosts;
};

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  return blogPosts.find(post => post.id === id) || null;
};

export const createBlogPost = async (title: string, description: string): Promise<BlogPost> => {
  // Check if a post with the same title and description already exists
  const existingPost = blogPosts.find(
    post => post.title === title && post.description === description
  );
  
  if (existingPost) {
    return existingPost;
  }

  const newPost: BlogPost = {
    id: Date.now().toString(),
    title,
    description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  blogPosts.push(newPost);
  return newPost;
};

export const updateBlogPost = async (id: string, title: string, description: string): Promise<BlogPost | null> => {
  const postIndex = blogPosts.findIndex(post => post.id === id);
  
  if (postIndex === -1) return null;
  
  blogPosts[postIndex] = {
    ...blogPosts[postIndex],
    title,
    description,
    updated_at: new Date().toISOString(),
  };
  
  return blogPosts[postIndex];
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  const initialLength = blogPosts.length;
  blogPosts = blogPosts.filter(post => post.id !== id);
  return blogPosts.length !== initialLength;
};

// Comments
export const getComments = async (postId: string): Promise<Comment[]> => {
  return comments.filter(comment => comment.post_id === postId);
};

export const addComment = async (postId: string, content: string, author: string): Promise<Comment> => {
  const newComment: Comment = {
    id: Date.now().toString(),
    post_id: postId,
    content,
    created_at: new Date().toISOString(),
    author,
  };
  
  comments.push(newComment);
  return newComment;
};

export const deleteComment = async (id: string): Promise<boolean> => {
  const initialLength = comments.length;
  comments = comments.filter(comment => comment.id !== id);
  return comments.length !== initialLength;
}; 
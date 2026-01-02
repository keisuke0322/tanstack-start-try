// Post type - represents a blog post
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// User type - represents a user
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

// Alias for backward compatibility
export type PostDetail = Post;

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import type { Post } from "@tanstack-start-try/types";
import { userQueryOptions } from "./posts.logic";

// ==========================================
// 🎨 スケルトンUI
// ==========================================
function PostCardSkeleton() {
  return (
    <div className="block rounded-lg bg-white p-6 shadow-sm">
      {/* タイトルスケルトン */}
      <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200" />
      {/* メタ情報スケルトン */}
      <div className="mt-2 flex items-center gap-4">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

// ==========================================
// 👤 ユーザー名表示コンポーネント（Suspenseで囲む）
// ==========================================
function UserName({ userId }: { userId: number }) {
  const { data: user } = useSuspenseQuery(userQueryOptions(userId));
  return <span>{user.name}</span>;
}

// ==========================================
// 📄 投稿カード内部コンポーネント
// ==========================================
type PostCardContentProps = {
  post: Post;
};

function PostCardContent({ post }: PostCardContentProps) {
  return (
    <Link
      to="/posts/$postId"
      params={{ postId: String(post.id) }}
      className="block rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
        <Suspense fallback={<div className="h-4 w-20 animate-pulse rounded bg-gray-200" />}>
          <UserName userId={post.userId} />
        </Suspense>
      </div>
    </Link>
  );
}

// ==========================================
// 📦 エクスポート: PostCardコンポーネント
// ==========================================
type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Suspense fallback={<PostCardSkeleton />}>
      <PostCardContent post={post} />
    </Suspense>
  );
}

// スケルトンもエクスポート（一覧ページでの初期ローディングに使用）
export { PostCardSkeleton };

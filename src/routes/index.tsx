import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white">
      {/* ヒーローセクション */}
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-6xl font-black tracking-tight">
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TanStack
            </span>{" "}
            <span className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Start / Router
            </span>
          </h1>
          <p className="text-xl text-slate-400">100% 型安全なフルスタック React フレームワーク</p>
        </div>

        {/* 特徴カード */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur">
            <div className="mb-4 text-4xl">🎯</div>
            <h3 className="mb-2 text-xl font-bold">100% 型安全</h3>
            <p className="text-slate-400">
              パラメータ、Search Params、Loaderデータ、すべて自動で型推論されます
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur">
            <div className="mb-4 text-4xl">🔗</div>
            <h3 className="mb-2 text-xl font-bold">Search Params</h3>
            <p className="text-slate-400">
              URLパラメータをファーストクラスのステート管理として扱えます
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur">
            <div className="mb-4 text-4xl">⚡</div>
            <h3 className="mb-2 text-xl font-bold">Server Functions</h3>
            <p className="text-slate-400">型安全なRPCでクライアントとサーバーをシームレスに接続</p>
          </div>
        </div>

        {/* デモへのリンク */}
        <div className="space-y-4">
          <h2 className="mb-6 text-center text-2xl font-bold">📚 講座デモ</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {/* 投稿一覧 */}
            <Link
              to="/posts"
              search={{ page: 1, q: "", sort: "newest" }}
              className="group rounded-xl border border-slate-700 bg-slate-800/30 p-6 transition-all hover:border-cyan-500 hover:bg-slate-800/50"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <h3 className="text-xl font-bold">投稿一覧</h3>
              </div>
              <p className="text-slate-400">
                Search Params + Valibot でページネーション・検索・ソートを実装
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400">
                  validateSearch
                </span>
                <span className="rounded bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400">
                  loaderDeps
                </span>
                <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                  Valibot
                </span>
              </div>
            </Link>

            {/* カウンター */}
            <Link
              to="/counter"
              className="group rounded-xl border border-slate-700 bg-slate-800/30 p-6 transition-all hover:border-emerald-500 hover:bg-slate-800/50"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-2xl">🔢</span>
                <h3 className="text-xl font-bold">カウンター</h3>
              </div>
              <p className="text-slate-400">Server Functions でサーバーサイドにデータを保存</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
                  createServerFn
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
                  router.invalidate
                </span>
              </div>
            </Link>

            {/* ダッシュボード（認証必須） */}
            <Link
              to="/dashboard"
              className="group rounded-xl border border-slate-700 bg-slate-800/30 p-6 transition-all hover:border-purple-500 hover:bg-slate-800/50"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <h3 className="text-xl font-bold">認証フロー</h3>
              </div>
              <p className="text-slate-400">
                未ログインでアクセス → ログインにリダイレクト → ダッシュボードへ
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                  beforeLoad
                </span>
                <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                  redirect
                </span>
                <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                  _pathless
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-16 text-center text-slate-500">
          <p>TanStack Start / Router 講座用デモ</p>
        </div>
      </div>
    </main>
  );
}

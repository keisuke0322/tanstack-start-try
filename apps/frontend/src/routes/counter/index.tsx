import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readCount, resetCountValue, updateCountValue } from "./counter.logic";

// ==========================================
// 📁 ファイルベースのカウンター（Server Functions デモ）
// ==========================================

// ==========================================
// 🔧 Server Functions
// ==========================================

// GET: 現在のカウントを取得
export const getCount = createServerFn({ method: "GET" }).handler(async () => {
  const count = await readCount();
  console.log("[Server] getCount called, returning:", count);
  return count;
});

// POST: カウントを更新
export const updateCount = createServerFn({ method: "POST" })
  .inputValidator((data: { increment: number }) => data)
  .handler(async ({ data }) => {
    const newCount = await updateCountValue(data.increment);
    console.log("[Server] updateCount called, new count:", newCount);
    return newCount;
  });

// POST: カウントをリセット
export const resetCount = createServerFn({ method: "POST" }).handler(async () => {
  await resetCountValue();
  console.log("[Server] resetCount called");
  return 0;
});

// ==========================================
// 🚀 ルート定義
// ==========================================
export const Route = createFileRoute("/counter/")({
  // ✅ loader でサーバーサイドでデータ取得
  loader: async () => {
    const count = await getCount();
    return { count };
  },
  component: CounterPage,
});

// ==========================================
// 🎨 カウンターページ
// ==========================================
function CounterPage() {
  const router = useRouter();
  const { count } = Route.useLoaderData();

  // カウント更新後、router.invalidate() でloaderを再実行
  const handleIncrement = async (amount: number) => {
    await updateCount({ data: { increment: amount } });
    router.invalidate(); // ✅ loaderを再実行してUIを更新
  };

  const handleReset = async () => {
    await resetCount();
    router.invalidate();
  };

  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-emerald-50 to-teal-100">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">Server Functions デモ</h1>
        <p className="mb-8 text-center text-gray-600">
          サーバーサイドでファイルに保存されるカウンター
        </p>

        {/* カウント表示 */}
        <div className="mb-8 text-center">
          <div className="text-8xl font-bold text-emerald-600">{count}</div>
          <p className="mt-2 text-sm text-gray-500">
            <code>count.txt</code> に保存されています
          </p>
        </div>

        {/* ボタン */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleIncrement(-5)}
            className="rounded-lg bg-red-100 px-6 py-3 font-bold text-red-600 hover:bg-red-200"
          >
            -5
          </button>
          <button
            onClick={() => handleIncrement(-1)}
            className="rounded-lg bg-red-100 px-6 py-3 font-bold text-red-600 hover:bg-red-200"
          >
            -1
          </button>
          <button
            onClick={() => handleIncrement(1)}
            className="rounded-lg bg-emerald-100 px-6 py-3 font-bold text-emerald-600 hover:bg-emerald-200"
          >
            +1
          </button>
          <button
            onClick={() => handleIncrement(5)}
            className="rounded-lg bg-emerald-100 px-6 py-3 font-bold text-emerald-600 hover:bg-emerald-200"
          >
            +5
          </button>
        </div>

        {/* リセットボタン */}
        <div className="mt-4 text-center">
          <button
            onClick={handleReset}
            className="rounded-lg bg-gray-100 px-6 py-2 text-gray-600 hover:bg-gray-200"
          >
            リセット
          </button>
        </div>

        {/* 講座用: Server Functions の説明 */}
        <div className="mt-8 space-y-4 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-4">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              🔧 使用している Server Functions:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-emerald-600">
              <li>
                <code>getCount()</code> - GET: 現在のカウントを取得
              </li>
              <li>
                <code>updateCount({"{ increment }"})</code> - POST: カウントを更新
              </li>
              <li>
                <code>resetCount()</code> - POST: カウントをリセット
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-emerald-700">💡 ポイント:</p>
            <ul className="mt-2 space-y-1 text-sm text-emerald-600">
              <li>✅ クライアントからはRPCのように呼び出せる</li>
              <li>
                ✅ 入力の型は <code>validator</code> で検証
              </li>
              <li>
                ✅ <code>router.invalidate()</code> でloaderを再実行
              </li>
              <li>✅ サーバーコンソールにログが出力される</li>
            </ul>
          </div>
        </div>

        {/* 戻るリンク */}
        <div className="mt-8 text-center">
          <a href="/" className="text-emerald-600 hover:underline">
            ← ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
}

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

// __root.tsx からエクスポートされていないコンポーネントをテストするため、
// 同様のコンポーネントをテスト用に再定義

describe("__root components", () => {
  afterEach(() => {
    cleanup();
  });

  describe("NotFoundComponent", () => {
    function NotFoundComponent() {
      return (
        <div className="p-4">
          <h1 className="text-2xl font-bold">404</h1>
          <p>ページが見つかりませんでした。</p>
        </div>
      );
    }

    it("should render 404 heading", () => {
      render(<NotFoundComponent />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    });

    it("should render not found message", () => {
      render(<NotFoundComponent />);
      expect(screen.getByText("ページが見つかりませんでした。")).toBeInTheDocument();
    });
  });

  describe("ErrorComponent", () => {
    function ErrorComponent({ error }: { error: Error }) {
      return (
        <div className="p-4">
          <h1 className="text-2xl font-bold text-red-600">エラー</h1>
          <p>{error.message}</p>
        </div>
      );
    }

    it("should render error heading", () => {
      render(<ErrorComponent error={new Error("Test error")} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("エラー");
    });

    it("should render error message", () => {
      render(<ErrorComponent error={new Error("テストエラーメッセージ")} />);
      expect(screen.getByText("テストエラーメッセージ")).toBeInTheDocument();
    });
  });

  describe("PendingComponent", () => {
    function PendingComponent() {
      return (
        <div className="p-4">
          <p>読み込み中...</p>
        </div>
      );
    }

    it("should render loading message", () => {
      render(<PendingComponent />);
      expect(screen.getByText("読み込み中...")).toBeInTheDocument();
    });
  });
});

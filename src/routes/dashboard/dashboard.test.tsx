import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// ダッシュボードのUIコンポーネントテスト用

type User = { id: string; name: string; email: string };

// ローディング状態コンポーネント
function LoadingState() {
  return (
    <div>
      <p>認証を確認中...</p>
    </div>
  );
}

// ユーザー情報表示コンポーネント
function UserInfo({ user }: { user: User }) {
  return (
    <div>
      <p data-testid="user-name">
        <span>名前:</span> {user.name}
      </p>
      <p data-testid="user-email">
        <span>メール:</span> {user.email}
      </p>
      <p data-testid="user-id">
        <span>ID:</span> {user.id}
      </p>
    </div>
  );
}

// ログアウトボタンコンポーネント
function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button type="button" onClick={onLogout}>
      ログアウト
    </button>
  );
}

// ダッシュボードコンポーネント（テスト用に簡略化）
function Dashboard({
  user,
  isLoading,
  onLogout,
}: {
  user: User | null;
  isLoading: boolean;
  onLogout: () => void;
}) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>ダッシュボード</h1>
      <p>認証が必要なページ</p>
      <UserInfo user={user} />
      <LogoutButton onLogout={onLogout} />
    </div>
  );
}

describe("Dashboard", () => {
  afterEach(() => {
    cleanup();
  });

  describe("LoadingState", () => {
    it("should render loading message", () => {
      render(<LoadingState />);
      expect(screen.getByText("認証を確認中...")).toBeInTheDocument();
    });
  });

  describe("UserInfo", () => {
    const mockUser: User = {
      id: "1",
      name: "デモユーザー",
      email: "demo@example.com",
    };

    it("should display user name", () => {
      render(<UserInfo user={mockUser} />);
      expect(screen.getByTestId("user-name")).toHaveTextContent("デモユーザー");
    });

    it("should display user email", () => {
      render(<UserInfo user={mockUser} />);
      expect(screen.getByTestId("user-email")).toHaveTextContent("demo@example.com");
    });

    it("should display user id", () => {
      render(<UserInfo user={mockUser} />);
      expect(screen.getByTestId("user-id")).toHaveTextContent("1");
    });
  });

  describe("LogoutButton", () => {
    it("should call onLogout when clicked", () => {
      const mockLogout = vi.fn();
      render(<LogoutButton onLogout={mockLogout} />);

      fireEvent.click(screen.getByRole("button", { name: "ログアウト" }));

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("Dashboard Component", () => {
    const mockUser: User = {
      id: "1",
      name: "テストユーザー",
      email: "test@example.com",
    };

    it("should show loading state when isLoading is true", () => {
      render(<Dashboard user={null} isLoading={true} onLogout={vi.fn()} />);
      expect(screen.getByText("認証を確認中...")).toBeInTheDocument();
    });

    it("should render nothing when user is null and not loading", () => {
      const { container } = render(<Dashboard user={null} isLoading={false} onLogout={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it("should display dashboard when user is authenticated", () => {
      render(<Dashboard user={mockUser} isLoading={false} onLogout={vi.fn()} />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ダッシュボード");
      expect(screen.getByText("認証が必要なページ")).toBeInTheDocument();
    });

    it("should display user info when authenticated", () => {
      render(<Dashboard user={mockUser} isLoading={false} onLogout={vi.fn()} />);

      expect(screen.getByTestId("user-name")).toHaveTextContent("テストユーザー");
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    });

    it("should handle logout", () => {
      const mockLogout = vi.fn();
      render(<Dashboard user={mockUser} isLoading={false} onLogout={mockLogout} />);

      fireEvent.click(screen.getByRole("button", { name: "ログアウト" }));

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});

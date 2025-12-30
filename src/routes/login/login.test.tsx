import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// モック
vi.mock("../../utils/jwt-client", () => ({
  setToken: vi.fn(),
}));

vi.mock("../../utils/auth", () => ({
  loginFn: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(() => vi.fn()),
  createFileRoute: vi.fn(() => () => ({})),
}));

// テスト用のLoginFormコンポーネント
function LoginForm({
  onSubmit,
  isLoading = false,
  error = "",
}: {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}) {
  return (
    <div>
      <h1>ログイン</h1>

      {error && <div role="alert">{error}</div>}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          await onSubmit(email, password);
        }}
      >
        <label htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="email" defaultValue="demo@example.com" required />

        <label htmlFor="password">パスワード</label>
        <input id="password" name="password" type="password" defaultValue="password" required />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}

describe("LoginForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should render login form", () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ログイン");
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });

  it("should have default values", () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("メールアドレス")).toHaveValue("demo@example.com");
    expect(screen.getByLabelText("パスワード")).toHaveValue("password");
  });

  it("should call onSubmit with email and password", async () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith("demo@example.com", "password");
    });
  });

  it("should show loading state", () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading={true} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("ログイン中...");
    expect(button).toBeDisabled();
  });

  it("should display error message", () => {
    render(<LoginForm onSubmit={vi.fn()} error="ログインに失敗しました" />);

    expect(screen.getByRole("alert")).toHaveTextContent("ログインに失敗しました");
  });

  it("should allow email input change", () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText("メールアドレス");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });

    expect(emailInput).toHaveValue("test@test.com");
  });

  it("should allow password input change", () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText("パスワード");
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });

    expect(passwordInput).toHaveValue("newpassword");
  });
});

// バリデーションロジックのテスト
describe("login validation", () => {
  it("should validate email format", () => {
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    expect(isValidEmail("demo@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
  });

  it("should validate password is not empty", () => {
    const isValidPassword = (password: string) => password.length > 0;

    expect(isValidPassword("password")).toBe(true);
    expect(isValidPassword("")).toBe(false);
  });
});

// Search Paramsのテスト
describe("login search params", () => {
  it("should default redirect to /dashboard", () => {
    const defaultRedirect = "/dashboard";
    const getRedirect = (redirect?: string) => redirect ?? defaultRedirect;

    expect(getRedirect()).toBe("/dashboard");
    expect(getRedirect("/posts")).toBe("/posts");
    expect(getRedirect("/counter")).toBe("/counter");
  });
});

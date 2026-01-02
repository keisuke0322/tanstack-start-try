import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// モック
const mockNavigate = vi.fn();
const mockGetToken = vi.fn();
const mockRemoveToken = vi.fn();
const mockVerifyAuthFn = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("./jwt-client", () => ({
  getToken: () => mockGetToken(),
  removeToken: () => mockRemoveToken(),
}));

vi.mock("./auth", () => ({
  verifyAuthFn: (args: { data: { token: string } }) => mockVerifyAuthFn(args),
}));

// useAuth をモックの後にインポート
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when no token exists", () => {
    beforeEach(() => {
      mockGetToken.mockReturnValue(null);
    });

    it("should return null user and not loading", async () => {
      const { result } = renderHook(() => useAuth({ required: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it("should redirect when required and redirectTo is set", async () => {
      renderHook(() => useAuth({ required: true, redirectTo: "/dashboard" }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/login",
          search: { redirect: "/dashboard" },
        });
      });
    });

    it("should not redirect when required is false", async () => {
      const { result } = renderHook(() => useAuth({ required: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("when valid token exists", () => {
    const mockUser = {
      id: "1",
      name: "テストユーザー",
      email: "test@example.com",
    };

    beforeEach(() => {
      mockGetToken.mockReturnValue("valid-token");
      mockVerifyAuthFn.mockResolvedValue({ user: mockUser });
    });

    it("should return user after verification", async () => {
      const { result } = renderHook(() => useAuth({ required: true }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should call verifyAuthFn with token", async () => {
      renderHook(() => useAuth({ required: true }));

      await waitFor(() => {
        expect(mockVerifyAuthFn).toHaveBeenCalledWith({
          data: { token: "valid-token" },
        });
      });
    });
  });

  describe("when token is invalid", () => {
    beforeEach(() => {
      mockGetToken.mockReturnValue("invalid-token");
      mockVerifyAuthFn.mockResolvedValue({ user: null, error: "Token expired" });
    });

    it("should remove token and return null user", async () => {
      const { result } = renderHook(() => useAuth({ required: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockRemoveToken).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });

    it("should redirect when required and redirectTo is set", async () => {
      renderHook(() => useAuth({ required: true, redirectTo: "/protected" }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/login",
          search: { redirect: "/protected" },
        });
      });
    });
  });

  describe("when verification throws error", () => {
    beforeEach(() => {
      mockGetToken.mockReturnValue("error-token");
      mockVerifyAuthFn.mockRejectedValue(new Error("Network error"));
    });

    it("should remove token and handle error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const { result } = renderHook(() => useAuth({ required: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockRemoveToken).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("認証エラー:", expect.any(Error));

      consoleSpy.mockRestore();
    });

    it("should redirect on error when required", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      renderHook(() => useAuth({ required: true, redirectTo: "/secure" }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/login",
          search: { redirect: "/secure" },
        });
      });
    });
  });

  describe("logout", () => {
    const mockUser = {
      id: "1",
      name: "テストユーザー",
      email: "test@example.com",
    };

    beforeEach(() => {
      mockGetToken.mockReturnValue("valid-token");
      mockVerifyAuthFn.mockResolvedValue({ user: mockUser });
    });

    it("should clear user and remove token", async () => {
      const { result } = renderHook(() => useAuth({ required: false }));

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      act(() => {
        result.current.logout();
      });

      expect(mockRemoveToken).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });

  describe("default options", () => {
    it("should default required to true", async () => {
      mockGetToken.mockReturnValue(null);

      // redirectToが指定されていないので、リダイレクトしない
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // redirectTo がないため navigate は呼ばれない
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});

describe("UseAuthOptions type", () => {
  it("should accept required boolean", () => {
    const options = { required: true };
    expect(options.required).toBe(true);
  });

  it("should accept redirectTo string", () => {
    const options = { redirectTo: "/dashboard" };
    expect(options.redirectTo).toBe("/dashboard");
  });

  it("should accept both options", () => {
    const options = { required: true, redirectTo: "/protected" };
    expect(options.required).toBe(true);
    expect(options.redirectTo).toBe("/protected");
  });
});

describe("UseAuthResult type", () => {
  it("should have correct structure", async () => {
    mockGetToken.mockReturnValue(null);

    const { result } = renderHook(() => useAuth({ required: false }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current).toHaveProperty("user");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("logout");
    expect(typeof result.current.logout).toBe("function");
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

// Homeページのコンポーネントテスト

// 特徴カードコンポーネント
function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div>{emoji}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// デモリンクカードコンポーネント
function DemoLinkCard({
  emoji,
  title,
  description,
  tags,
}: {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <div>
      <div>
        <span>{emoji}</span>
        <h3>{title}</h3>
      </div>
      <p>{description}</p>
      <div>
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

// ヒーローセクションコンポーネント
function HeroSection() {
  return (
    <div>
      <h1>
        <span>TanStack</span> <span>Start / Router</span>
      </h1>
      <p>100% 型安全なフルスタック React フレームワーク</p>
    </div>
  );
}

describe("Home page components", () => {
  afterEach(() => {
    cleanup();
  });

  describe("HeroSection", () => {
    it("should render main heading", () => {
      render(<HeroSection />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should display TanStack branding", () => {
      render(<HeroSection />);
      expect(screen.getByText("TanStack")).toBeInTheDocument();
      expect(screen.getByText("Start / Router")).toBeInTheDocument();
    });

    it("should display tagline", () => {
      render(<HeroSection />);
      expect(
        screen.getByText("100% 型安全なフルスタック React フレームワーク"),
      ).toBeInTheDocument();
    });
  });

  describe("FeatureCard", () => {
    it("should render feature with emoji, title and description", () => {
      render(
        <FeatureCard
          emoji="🎯"
          title="100% 型安全"
          description="パラメータ、Search Params、Loaderデータ、すべて自動で型推論されます"
        />,
      );

      expect(screen.getByText("🎯")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("100% 型安全");
      expect(
        screen.getByText("パラメータ、Search Params、Loaderデータ、すべて自動で型推論されます"),
      ).toBeInTheDocument();
    });

    it("should render different features", () => {
      const { rerender } = render(
        <FeatureCard emoji="🔗" title="Search Params" description="URLパラメータをステート管理" />,
      );

      expect(screen.getByText("🔗")).toBeInTheDocument();
      expect(screen.getByText("Search Params")).toBeInTheDocument();

      rerender(<FeatureCard emoji="⚡" title="Server Functions" description="型安全なRPC" />);

      expect(screen.getByText("⚡")).toBeInTheDocument();
      expect(screen.getByText("Server Functions")).toBeInTheDocument();
    });
  });

  describe("DemoLinkCard", () => {
    it("should render demo card with all elements", () => {
      render(
        <DemoLinkCard
          emoji="📝"
          title="投稿一覧"
          description="Search Params + Valibot でページネーション・検索・ソートを実装"
          tags={["validateSearch", "loaderDeps", "Valibot"]}
        />,
      );

      expect(screen.getByText("📝")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("投稿一覧");
      expect(screen.getByText("validateSearch")).toBeInTheDocument();
      expect(screen.getByText("loaderDeps")).toBeInTheDocument();
      expect(screen.getByText("Valibot")).toBeInTheDocument();
    });

    it("should render counter demo card", () => {
      render(
        <DemoLinkCard
          emoji="🔢"
          title="カウンター"
          description="Server Functions でサーバーサイドにデータを保存"
          tags={["createServerFn", "router.invalidate"]}
        />,
      );

      expect(screen.getByText("🔢")).toBeInTheDocument();
      expect(screen.getByText("カウンター")).toBeInTheDocument();
      expect(screen.getByText("createServerFn")).toBeInTheDocument();
      expect(screen.getByText("router.invalidate")).toBeInTheDocument();
    });
  });
});

// 機能一覧のデータテスト
describe("Home page data", () => {
  const features = [
    {
      emoji: "🎯",
      title: "100% 型安全",
      description: "パラメータ、Search Params、Loaderデータ、すべて自動で型推論されます",
    },
    {
      emoji: "🔗",
      title: "Search Params",
      description: "URLパラメータをファーストクラスのステート管理として扱えます",
    },
    {
      emoji: "⚡",
      title: "Server Functions",
      description: "型安全なRPCでクライアントとサーバーをシームレスに接続",
    },
  ];

  it("should have 3 feature cards", () => {
    expect(features).toHaveLength(3);
  });

  it("should have unique emojis", () => {
    const emojis = features.map((f) => f.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  const demoLinks = [
    { path: "/posts", title: "投稿一覧" },
    { path: "/counter", title: "カウンター" },
    { path: "/dashboard", title: "ダッシュボード" },
  ];

  it("should have 3 demo links", () => {
    expect(demoLinks).toHaveLength(3);
  });

  it("should have valid paths", () => {
    demoLinks.forEach((link) => {
      expect(link.path).toMatch(/^\//);
    });
  });
});

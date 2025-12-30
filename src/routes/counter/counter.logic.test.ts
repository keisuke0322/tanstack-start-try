import * as fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";
import {
  COUNT_FILE_PATH,
  calculateNewCount,
  parseCount,
  readCount,
  resetCountValue,
  updateCountValue,
  writeCount,
} from "./counter.logic";

// fs モジュールをモック
vi.mock("node:fs", () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

// モックの型定義
const mockReadFile = fs.promises.readFile as MockedFunction<typeof fs.promises.readFile>;
const mockWriteFile = fs.promises.writeFile as MockedFunction<typeof fs.promises.writeFile>;

describe("counter utility functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("parseCount", () => {
    it("should parse valid number string", () => {
      expect(parseCount("42")).toBe(42);
    });

    it("should return 0 for invalid string", () => {
      expect(parseCount("invalid")).toBe(0);
    });

    it("should return 0 for empty string", () => {
      expect(parseCount("")).toBe(0);
    });

    it("should handle negative numbers", () => {
      expect(parseCount("-5")).toBe(-5);
    });
  });

  describe("calculateNewCount", () => {
    it("should add positive increment", () => {
      expect(calculateNewCount(10, 5)).toBe(15);
    });

    it("should add negative increment (decrement)", () => {
      expect(calculateNewCount(10, -3)).toBe(7);
    });

    it("should handle zero increment", () => {
      expect(calculateNewCount(10, 0)).toBe(10);
    });

    it("should handle negative result", () => {
      expect(calculateNewCount(5, -10)).toBe(-5);
    });
  });

  describe("readCount", () => {
    it("should return count from file", async () => {
      mockReadFile.mockResolvedValue("42");

      const count = await readCount();

      expect(count).toBe(42);
      expect(fs.promises.readFile).toHaveBeenCalledWith(COUNT_FILE_PATH, "utf-8");
    });

    it("should return 0 when file content is not a number", async () => {
      mockReadFile.mockResolvedValue("invalid");

      const count = await readCount();

      expect(count).toBe(0);
    });

    it("should return 0 when file does not exist", async () => {
      mockReadFile.mockRejectedValue(new Error("ENOENT"));

      const count = await readCount();

      expect(count).toBe(0);
    });

    it("should return 0 for empty file", async () => {
      mockReadFile.mockResolvedValue("");

      const count = await readCount();

      expect(count).toBe(0);
    });

    it("should use custom file path when provided", async () => {
      mockReadFile.mockResolvedValue("100");

      await readCount("custom.txt");

      expect(fs.promises.readFile).toHaveBeenCalledWith("custom.txt", "utf-8");
    });
  });

  describe("writeCount", () => {
    it("should write count to file", async () => {
      mockWriteFile.mockResolvedValue(undefined);

      await writeCount(42);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(COUNT_FILE_PATH, "42");
    });

    it("should use custom file path when provided", async () => {
      mockWriteFile.mockResolvedValue(undefined);

      await writeCount(100, "custom.txt");

      expect(fs.promises.writeFile).toHaveBeenCalledWith("custom.txt", "100");
    });
  });

  describe("updateCountValue", () => {
    it("should increment count correctly", async () => {
      mockReadFile.mockResolvedValue("10");
      mockWriteFile.mockResolvedValue(undefined);

      const newCount = await updateCountValue(5);

      expect(newCount).toBe(15);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(COUNT_FILE_PATH, "15");
    });

    it("should decrement count correctly", async () => {
      mockReadFile.mockResolvedValue("10");
      mockWriteFile.mockResolvedValue(undefined);

      const newCount = await updateCountValue(-5);

      expect(newCount).toBe(5);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(COUNT_FILE_PATH, "5");
    });

    it("should handle file not existing", async () => {
      mockReadFile.mockRejectedValue(new Error("ENOENT"));
      mockWriteFile.mockResolvedValue(undefined);

      const newCount = await updateCountValue(5);

      expect(newCount).toBe(5);
    });
  });

  describe("resetCountValue", () => {
    it("should reset count to 0", async () => {
      mockWriteFile.mockResolvedValue(undefined);

      const count = await resetCountValue();

      expect(count).toBe(0);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(COUNT_FILE_PATH, "0");
    });
  });
});

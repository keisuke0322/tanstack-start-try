import * as fs from "node:fs";

// ==========================================
// 📁 カウンターロジック
// ==========================================

export const COUNT_FILE_PATH = "count.txt";

/**
 * 文字列からカウント値をパース
 */
export function parseCount(content: string): number {
  return parseInt(content, 10) || 0;
}

/**
 * 新しいカウント値を計算
 */
export function calculateNewCount(current: number, increment: number): number {
  return current + increment;
}

/**
 * ファイルからカウントを読み取る
 */
export async function readCount(filePath: string = COUNT_FILE_PATH): Promise<number> {
  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    return parseCount(content);
  } catch {
    return 0;
  }
}

/**
 * ファイルにカウントを書き込む
 */
export async function writeCount(count: number, filePath: string = COUNT_FILE_PATH): Promise<void> {
  await fs.promises.writeFile(filePath, String(count));
}

/**
 * カウントを更新（読み取り + 加算 + 書き込み）
 */
export async function updateCountValue(
  increment: number,
  filePath: string = COUNT_FILE_PATH,
): Promise<number> {
  const currentCount = await readCount(filePath);
  const newCount = calculateNewCount(currentCount, increment);
  await writeCount(newCount, filePath);
  return newCount;
}

/**
 * カウントをリセット
 */
export async function resetCountValue(filePath: string = COUNT_FILE_PATH): Promise<number> {
  await writeCount(0, filePath);
  return 0;
}

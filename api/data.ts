import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = 'data.json';

const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

const githubHeaders = {
  Authorization: `token ${GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

// Fetch the current file SHA and contents
async function getFileInfo(): Promise<{ sha: string; content: string } | null> {
  const res = await fetch(`${GITHUB_API_URL}?ref=${GITHUB_BRANCH}`, {
    headers: githubHeaders,
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.statusText}`);

  const json = await res.json();
  // GitHub returns base64-encoded content
  const content = Buffer.from(json.content, 'base64').toString('utf-8');
  return { sha: json.sha, content };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const fileInfo = await getFileInfo();

      if (!fileInfo) {
        // data.json doesn't exist in the repo yet
        return res.status(200).json({ links: [], folders: [] });
      }

      return res.status(200).send(fileInfo.content);
    }

    if (req.method === 'PUT') {
      const newContent = JSON.stringify(req.body, null, 2);
      const encodedContent = Buffer.from(newContent).toString('base64');

      // Get current SHA (required by GitHub API to update a file)
      const fileInfo = await getFileInfo();

      const payload: Record<string, unknown> = {
        message: 'Auto-update: saved link data',
        content: encodedContent,
        branch: GITHUB_BRANCH,
      };

      if (fileInfo) {
        payload.sha = fileInfo.sha;
      }

      const updateRes = await fetch(GITHUB_API_URL, {
        method: 'PUT',
        headers: githubHeaders,
        body: JSON.stringify(payload),
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        throw new Error(`GitHub PUT failed: ${errorText}`);
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: unknown) {
    console.error('API Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}

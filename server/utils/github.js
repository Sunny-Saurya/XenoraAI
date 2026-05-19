import axios from 'axios';

const getHeaders = () => {
  const token = process.env.GITHUB_TOKEN?.trim();
  return token ? { Authorization: `token ${token}` } : {};
};

// Helper to extract owner and repo from URL
export const parseGithubUrl = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      throw new Error('Not a valid GitHub URL');
    }
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      throw new Error('Could not parse owner and repo from URL');
    }
    return { owner: parts[0], repo: parts[1] };
  } catch (error) {
    throw new Error('Invalid GitHub URL');
  }
};

// Fetch repository default branch
export const fetchRepoDetails = async (owner, repo) => {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers: getHeaders() });
  return response.data;
};

// Fetch recursive tree
export const fetchRepoTree = async (owner, repo, branch) => {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers: getHeaders() });
  return response.data.tree;
};

// Fetch file content
export const fetchFileContent = async (owner, repo, path) => {
  try {
    const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    return null;
  }
};

import { UserStats } from "../types";

const API_BASE = "https://api.github.com";

interface Repo {
  name: string;
  stargazers_count: number;
  fork: boolean;
}

interface SearchResult {
  total_count: number;
}

export const fetchUserStats = async (username: string): Promise<UserStats> => {
  // 1. Fetch User Profile
  const userRes = await fetch(`${API_BASE}/users/${username}`);
  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error("User not found");
    if (userRes.status === 403) throw new Error("API Rate limit exceeded. Please try again later.");
    throw new Error("Failed to fetch user data");
  }
  const userData = await userRes.json();

  // 2. Fetch Repos to count Stars (Max 100 for this demo to avoid pagination hell / rate limits)
  // We prioritize original repos (not forks) but stars on forks technically count towards the repo owner, 
  // but for Starstruck it's usually stars on YOUR repos.
  const reposRes = await fetch(`${API_BASE}/users/${username}/repos?per_page=100&type=owner&sort=updated`);
  let totalStars = 0;
  let maxStarCount = 0;
  let bestRepoName = '';

  if (reposRes.ok) {
    const repos: Repo[] = await reposRes.json();
    totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    
    // Find the repo with the most stars for the Starstruck badge
    repos.forEach(repo => {
      if (repo.stargazers_count > maxStarCount) {
        maxStarCount = repo.stargazers_count;
        bestRepoName = repo.name;
      }
    });
  }

  // 3. Fetch Merged PRs count (Pull Shark)
  // search/issues?q=type:pr+author:USERNAME+is:merged
  const prsRes = await fetch(`${API_BASE}/search/issues?q=type:pr+author:${username}+is:merged`);
  let mergedPRs = 0;
  if (prsRes.ok) {
    const prsData: SearchResult = await prsRes.json();
    mergedPRs = prsData.total_count;
  }

  // 4. Fetch Accepted Answers (Galaxy Brain)
  // search/issues?q=is:answer+author:USERNAME
  const answersRes = await fetch(`${API_BASE}/search/issues?q=is:answer+author:${username}`);
  let acceptedAnswers = 0;
  if (answersRes.ok) {
    const answersData: SearchResult = await answersRes.json();
    acceptedAnswers = answersData.total_count;
  }

  return {
    username: userData.login,
    name: userData.name || userData.login,
    avatarUrl: userData.avatar_url,
    bio: userData.bio,
    publicRepos: userData.public_repos,
    totalStars,
    maxStarCount,
    bestRepoName,
    mergedPRs,
    acceptedAnswers
  };
};
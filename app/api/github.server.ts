import { Octokit } from "octokit";
import type { WrappedData } from "../types";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionResponse {
  total: {
    [year: number]: number;
    [year: string]: number; // API sometimes returns string keys
  };
  contributions: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

async function fetchContributionData(
  username: string,
  year: number
): Promise<{ total: number; days: ContributionDay[] }> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
    );
    if (!res.ok) return { total: 0, days: [] };
    const data = (await res.json()) as ContributionResponse;
    return {
      total: data.total?.[year] || 0,
      days: data.contributions || [],
    };
  } catch (e) {
    console.error("Failed to fetch contributions:", e);
    return { total: 0, days: [] };
  }
}

export async function fetchGitHubData(
  username: string,
  token?: string
): Promise<WrappedData> {
  const octokit = new Octokit({ auth: token });

  // Determine Wrapped Year
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();
  // If December (11), show current year. Otherwise show previous year.
  const year = currentMonth === 11 ? currentYear : currentYear - 1;

  // 1. Fetch Profile
  const { data: profile } = await octokit.rest.users.getByUsername({
    username,
  });

  // 2. Fetch Repos (up to 100 for now, sorted by updated)
  const { data: repos } = await octokit.rest.repos.listForUser({
    username,
    sort: "updated",
    per_page: 100,
    type: token ? "all" : "owner", // Changed "public" to "owner" or "all" to match types
  });

  // 3. Calculate Language Stats
  const languageMap: Record<string, number> = {};
  let totalReposWithLang = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      totalReposWithLang++;
    }
  });

  const topLanguages = Object.entries(languageMap)
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        totalReposWithLang > 0 ? (count / totalReposWithLang) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 4. Calculate Total Stars
  const totalStars = repos.reduce(
    (sum, repo) => sum + (repo.stargazers_count || 0),
    0
  );

  // 5. Estimate Commits & Activity (Mock logic for now, real implementation needs GraphQL or events)
  // For a real "Wrapped", we'd fetch commit history. Due to rate limits/complexity,
  // we'll use a simplified heuristic or fetch events if possible.
  // Let's fetch public events to get a sense of activity.
  const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
    username,
    per_page: 100,
  });

  const pushEvents = events.filter((e) => e.type === "PushEvent");

  // Use external API for accurate total commits count and daily data
  const contributionData = await fetchContributionData(username, year);
  const totalCommits = contributionData.total;

  // Calculate Longest Streak
  let longestStreak = 0;
  let currentStreak = 0;
  // Sort days just in case
  const sortedDays = contributionData.days.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const day of sortedDays) {
    if (day.count > 0) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  // Calculate Most Productive Month
  const monthCounts: Record<string, number> = {};
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  sortedDays.forEach((day) => {
    const date = new Date(day.date);
    const month = monthNames[date.getMonth()];
    monthCounts[month] = (monthCounts[month] || 0) + day.count;
  });

  let mostProductiveMonth = { name: "January", count: 0 };
  Object.entries(monthCounts).forEach(([name, count]) => {
    if (count > mostProductiveMonth.count) {
      mostProductiveMonth = { name, count };
    }
  });

  // Calculate Universal Rank (Heuristic)
  let universalRank = "Top 50%";
  if (totalCommits > 1000) universalRank = "Top 1%";
  else if (totalCommits > 500) universalRank = "Top 5%";
  else if (totalCommits > 200) universalRank = "Top 10%";
  else if (totalCommits > 100) universalRank = "Top 25%";

  // Analyze timestamps for "Busiest Time"
  const hours = pushEvents.map((e) => new Date(e.created_at || "").getHours());
  const morning = hours.filter((h) => h >= 5 && h < 12).length;
  const afternoon = hours.filter((h) => h >= 12 && h < 18).length;
  const evening = hours.filter((h) => h >= 18 && h < 23).length;
  const night = hours.filter((h) => h >= 23 || h < 5).length;

  let busiestTime = "Daytime";
  const maxTime = Math.max(morning, afternoon, evening, night);
  if (maxTime === morning) busiestTime = "Early Bird";
  if (maxTime === afternoon) busiestTime = "Lunchtime Coder";
  if (maxTime === evening) busiestTime = "Evening Hacker";
  if (maxTime === night) busiestTime = "Night Owl";

  // Analyze days for "Busiest Day"
  const days = pushEvents.map((e) => new Date(e.created_at || "").getDay());
  const dayCounts = new Array(7).fill(0);
  days.forEach((d) => dayCounts[d]++);
  const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const busiestDay = daysOfWeek[maxDayIndex];

  // Fetch previous year data for comparison
  const previousYear = year - 1;
  const previousYearData = await fetchContributionData(username, previousYear);

  // Calculate previous year stats
  let previousLongestStreak = 0;
  let previousCurrentStreak = 0;
  const previousSortedDays = previousYearData.days.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const day of previousSortedDays) {
    if (day.count > 0) {
      previousCurrentStreak++;
    } else {
      previousLongestStreak = Math.max(
        previousLongestStreak,
        previousCurrentStreak
      );
      previousCurrentStreak = 0;
    }
  }
  previousLongestStreak = Math.max(
    previousLongestStreak,
    previousCurrentStreak
  );

  // Fetch previous year repos (we'll estimate stars from current repos that existed then)
  // For simplicity, we'll use a heuristic based on creation dates
  // Note: We can't get exact star counts from previous year, so we estimate
  // by assuming repos created before previous year had fewer stars
  const previousYearRepos = repos.filter((repo) => {
    if (!repo.created_at) return false;
    const repoYear = new Date(repo.created_at).getFullYear();
    return repoYear <= previousYear;
  });

  // Estimate previous year stars: assume repos gained stars proportionally
  // This is a rough estimate - in reality we'd need historical star data
  const previousYearStars = Math.max(
    0,
    Math.round(
      previousYearRepos.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0
      ) * 0.7
    )
  );

  // Calculate comparison
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const previousYearComparison = {
    totalCommits: {
      current: totalCommits,
      previous: previousYearData.total,
      change: calculateChange(totalCommits, previousYearData.total),
    },
    totalStars: {
      current: totalStars,
      previous: previousYearStars,
      change: calculateChange(totalStars, previousYearStars),
    },
    longestStreak: {
      current: longestStreak,
      previous: previousLongestStreak,
      change: calculateChange(longestStreak, previousLongestStreak),
    },
    publicRepos: {
      current: profile.public_repos,
      previous: previousYearRepos.length,
      change: calculateChange(profile.public_repos, previousYearRepos.length),
    },
  };

  // Predict next year
  const calculatePrediction = () => {
    // Simple linear regression based on growth rate
    const commitsGrowthRate =
      previousYearData.total > 0
        ? (totalCommits - previousYearData.total) / previousYearData.total
        : 0.1; // Default 10% growth if no previous data

    const starsGrowthRate =
      previousYearStars > 0
        ? (totalStars - previousYearStars) / previousYearStars
        : 0.1;

    const streakGrowthRate =
      previousLongestStreak > 0
        ? (longestStreak - previousLongestStreak) / previousLongestStreak
        : 0;

    // Predict with some smoothing (average of growth and current trend)
    const predictedCommits = Math.round(
      totalCommits * (1 + Math.max(commitsGrowthRate, 0.05))
    );
    const predictedStars = Math.round(
      totalStars * (1 + Math.max(starsGrowthRate, 0.05))
    );
    const predictedStreak = Math.round(
      longestStreak * (1 + Math.max(streakGrowthRate, 0))
    );

    // Determine confidence based on data availability
    let confidence = "Medium";
    if (previousYearData.total > 0 && previousYearStars > 0) {
      confidence = "High";
    } else if (previousYearData.total === 0 && previousYearStars === 0) {
      confidence = "Low";
    }

    // Generate motivational message
    const messages = [
      `Keep pushing! You're on track for ${predictedCommits.toLocaleString()} commits next year!`,
      `Your coding journey is accelerating! Aim for ${predictedStreak} day streak!`,
      `The stars are aligning! You could reach ${predictedStars.toLocaleString()} stars!`,
      `Your momentum is unstoppable! Keep coding and watch your numbers soar!`,
      `Next year will be even better! Challenge yourself to beat these predictions!`,
      `You're building something amazing! ${predictedCommits.toLocaleString()} commits is within reach!`,
      `Every commit counts! You're on fire - keep it up!`,
      `The future is bright! Your dedication will pay off!`,
      `Stay consistent! ${predictedStreak} days is just the beginning!`,
      `Your code is making an impact! Keep pushing forward!`,
    ];

    // Select message based on growth and activity
    let messageIndex = 0;
    if (commitsGrowthRate > 0.3)
      messageIndex = 0; // Very high growth
    else if (streakGrowthRate > 0.15)
      messageIndex = 1; // Streak focus
    else if (starsGrowthRate > 0.3)
      messageIndex = 2; // Stars focus
    else if (commitsGrowthRate > 0.2)
      messageIndex = 3; // High growth
    else if (commitsGrowthRate > 0.1)
      messageIndex = 4; // Positive growth
    else if (totalCommits > 500)
      messageIndex = 5; // High activity
    else if (longestStreak > 50)
      messageIndex = 8; // Long streak
    else if (commitsGrowthRate > 0)
      messageIndex = 6; // Some growth
    else messageIndex = 7; // General motivation

    return {
      predictedCommits,
      predictedStars,
      predictedStreak,
      message: messages[messageIndex],
      confidence,
    };
  };

  const nextYearPrediction = calculatePrediction();

  return {
    profile: {
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      html_url: profile.html_url,
      bio: profile.bio,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at,
    },
    repos: repos.map((r) => ({
      name: r.name,
      description: r.description,
      stargazers_count: r.stargazers_count || 0,
      language: r.language || null, // Ensure null if undefined
      html_url: r.html_url,
      fork: r.fork,
    })),
    topLanguages,
    totalStars,
    totalCommits,
    longestStreak,
    mostProductiveMonth,
    universalRank,
    busiestDay,
    busiestTime,
    year,
    previousYearComparison,
    nextYearPrediction,
  };
}

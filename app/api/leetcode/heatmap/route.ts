import { NextRequest, NextResponse } from "next/server";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

const QUERY = `
query userProfileCalendar($username: String!, $year: Int) {
  matchedUser(username: $username) {
    userCalendar(year: $year) {
      submissionCalendar
    }
  }
}
`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "gyaanendra";
  const year = searchParams.get("year");
  const refresh = searchParams.get("refresh") === "1";

  const variables: Record<string, string | number> = { username };
  if (year) variables.year = parseInt(year);

  try {
    const fetchOpts: RequestInit & { next?: { revalidate: number } } = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: `https://leetcode.com/${username}/`,
        Origin: "https://leetcode.com",
      },
      body: JSON.stringify({ query: QUERY, variables }),
    };

    if (refresh) {
      fetchOpts.cache = "no-store";
    } else {
      fetchOpts.next = { revalidate: 3600 };
    }

    const res = await fetch(LEETCODE_GRAPHQL, fetchOpts);
    const data = await res.json();

    const matchedUser = data.data?.matchedUser;
    if (!matchedUser) {
      return NextResponse.json({ error: "LeetCode user not found or profile is private" }, { status: 404 });
    }

    const calendarStr = matchedUser.userCalendar?.submissionCalendar || "{}";
    const submissionCalendar: Record<string, number> = JSON.parse(calendarStr);

    return NextResponse.json({ submissionCalendar });
  } catch {
    return NextResponse.json({ error: "Failed to fetch LeetCode data" }, { status: 502 });
  }
}

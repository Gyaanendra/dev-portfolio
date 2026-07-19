import { NextRequest, NextResponse } from "next/server";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const QUERY = `
query($username: String!, $from: DateTime, $to: DateTime) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}
`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "Gyaanendra";
  const year = searchParams.get("year");
  const refresh = searchParams.get("refresh") === "1";

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 });
  }

  const variables: Record<string, string> = { username };
  if (year) {
    variables.from = `${year}-01-01T00:00:00Z`;
    variables.to = `${year}-12-31T23:59:59Z`;
  }

  try {
    const fetchOpts: RequestInit & { next?: { revalidate: number } } = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-heatmap",
      },
      body: JSON.stringify({ query: QUERY, variables }),
    };
    if (refresh) {
      fetchOpts.cache = "no-store";
    } else {
      fetchOpts.next = { revalidate: 3600 };
    }
    const res = await fetch(GITHUB_GRAPHQL, fetchOpts);

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0].message }, { status: 404 });
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(calendar);
  } catch {
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 502 });
  }
}

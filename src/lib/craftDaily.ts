export class CraftDailyClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  async getDailyNoteId(date: string): Promise<string> {
    const url = `${this.baseUrl}/blocks?date=${encodeURIComponent(date)}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch daily note: ${response.status} ${text}`);
    }

    const data = (await response.json()) as { id?: string };
    if (!data.id) {
      throw new Error("Daily note ID missing in response");
    }

    return data.id;
  }
}

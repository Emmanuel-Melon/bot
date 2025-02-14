import fetch from 'node-fetch';

interface NotificationPayload {
  status: string;
  run_id: string;
  repo: string;
  commit: string;
  actor: string;
  details_url: string;
  test_results: string;
}

export class NotificationService {
  async processNotification(payload: NotificationPayload) {
    const promises: Promise<any>[] = [];

    if (process.env.DISCORD_WEBHOOK) {
      promises.push(this.sendToDiscord(payload));
    }

    if (process.env.LINEAR_API_KEY) {
      promises.push(this.createLinearIssue(payload));
    }

    await Promise.all(promises);
  }

  private async sendToDiscord(payload: NotificationPayload) {
    const discordMessage = {
      embeds: [{
        title: `Test Failure in ${payload.repo}`,
        color: 0xff0000,
        fields: [
          { name: 'Commit', value: payload.commit },
          { name: 'Triggered by', value: payload.actor },
          { name: 'Details', value: payload.details_url }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(process.env.DISCORD_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage)
    });

    if (!response.ok) {
      throw new Error(`Discord notification failed: ${response.statusText}`);
    }
  }

  private async createLinearIssue(payload: NotificationPayload) {
    const query = `
      mutation IssueCreate {
        issueCreate(input: {
          title: "Test Failure in ${payload.repo}",
          description: "Commit: ${payload.commit}\\nDetails: ${payload.details_url}",
          teamId: "${process.env.LINEAR_TEAM_ID}"
        }) {
          success
          issue {
            id
            url
          }
        }
      }
    `;

    const response = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.LINEAR_API_KEY!
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Linear issue creation failed: ${response.statusText}`);
    }
  }
}

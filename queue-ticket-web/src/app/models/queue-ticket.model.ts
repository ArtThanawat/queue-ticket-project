export interface QueueTicket {
  readonly id: string;
  readonly queueIndex: number;
  readonly queueNumber: string;
  readonly status: string;
  readonly createdAt: string;
}

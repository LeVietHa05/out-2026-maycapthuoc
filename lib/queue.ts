export const queue: { msg: string; timestamp: number }[] = [];

export function addToQueue(msg: string) {
  queue.push({ msg, timestamp: Date.now() });
}

export function getNextOrder(): string | null {
  const now = Date.now();
  for (let i = 0; i < queue.length; i++) {
    if (now - queue[i].timestamp <= 60000) { // 60 seconds TTL
      const msg = queue[i].msg;
      queue.splice(i, 1);
      return msg;
    } else {
      // Remove expired
      queue.splice(i, 1);
      i--; // Adjust index after removal
    }
  }
  return null;
}
export function getUserKey(userId: string): string {
    return `user-${userId}`;
}

export function getAppointmentKey(appointmentId: string): string {
  return `appointment-${appointmentId}`;
}
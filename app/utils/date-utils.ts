import { format, parseISO } from "date-fns"

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMM d, yyyy")
  } catch (error) {
    return dateString
  }
}

export function formatTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours))
    date.setMinutes(Number.parseInt(minutes))
    return format(date, "h:mm a")
  } catch (error) {
    return timeString
  }
}


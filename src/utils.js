export const pace = ({ duration, distance }) => (1609 / distance) * duration

const ONE_BILLION = Math.pow(10, 9)
export const duration = ({ start, end }) => {
  const seconds = [start, end].map(time => {
    let timeSeconds
    if (time.seconds) {
      timeSeconds = time.seconds + time.nanoseconds / ONE_BILLION
    } else {
      timeSeconds = time.getTime()
    }
    return timeSeconds
  })

  return seconds[1] - seconds[0]
}

import React, { Fragment } from 'react'
import { pace, duration, metersToMiles, milesToMeters } from '../../utils'
import { scaleLinear, line, max, min, curveMonotoneX } from 'd3'
import { secondsToTime } from '../DataFields/ElapsedTime'

const WIDTH = 500
const HEIGHT = 200
const MARGIN_X = 50
const MARGIN_Y = 30
const fontSize = 12

const PaceChart = ({ data }) => {

  const laps = data.laps.reduce((acc, lap) => {
    const prev = acc[acc.length - 1] || { distance: 0, }
    const lapDuration = duration({ start: lap.start, end: lap.end })
    acc.push({
      distance: prev.distance + lap.distance,
      pace: pace({ duration: lapDuration, distance: lap.distance })
    })

    return acc
  }, [])

  const minPace = min(laps, l => l.pace) * 0.9
  const maxPace = max(laps, l => l.pace) * 1.1
  const xScale = scaleLinear().domain([0, data.goal]).range([0, WIDTH])
  const yScale = scaleLinear().domain([minPace, maxPace]).range([HEIGHT, 0])
  const linePath = line()
    .x(d => xScale(d.distance))
    .y(d => yScale(d.pace))
    .curve(curveMonotoneX)

  return (
    <svg viewBox={`0 0 ${WIDTH + (MARGIN_X * 2)} ${HEIGHT + (MARGIN_Y * 2)}`} width={WIDTH + (MARGIN_X * 2)} height={HEIGHT + (MARGIN_Y * 2)}>
      <g transform={`translate(${MARGIN_X}, ${MARGIN_Y})`}>
        <XAxis scale={xScale} />
        <YAxis scale={yScale} />

        <path d={linePath(laps)} style={{
          stroke: 'white',
          fill: 'transparent'
        }} />
      </g>
    </svg>
  )
}

const XAxis = ({ scale }) => {

  const domain = scale.domain()
  const meters = domain[1] - domain[0]
  const miles = metersToMiles(meters)

  const ticks = Math.floor(miles)

  return (
    <g data-x-axis transform={`translate(0, ${HEIGHT})`}>
      <line x1={0} x2={WIDTH} y1={0} y2={0} style={{ stroke: 'white' }} />
      <g data-ticks>
        {
          Array(ticks).fill(null).map((_, i) => {
            const x = scale(milesToMeters(i + 1))
            return (
              <Fragment key={i}>
                <line x1={x} x2={x} y1={0} y2={5} style={{ stroke: 'white' }} />
                {
                  (i % 2) !== 0 && (
                    <text x={x} y={5 + fontSize} style={{ fill: 'white', textAnchor: 'middle', fontSize }}>
                      {i + 1}
                    </text>
                  )
                }
              </Fragment>
            )
          })
        }
      </g>
    </g>
  )
}

const YAxis = ({ scale }) => {
  const domain = scale.domain()
  const firstTick = Math.floor(domain[0] / 15)
  const lastTick = Math.floor(domain[1] / 15)

  return (
    <g data-y-axis transform={`translate(0, 0)`}>
      <line x1={0} x2={0} y1={0} y2={HEIGHT} style={{ stroke: 'white' }} />
      <g data-ticks>
        {
          Array(lastTick - firstTick).fill(null).map((_, i) => {
            const secondsPerMile = (i + 1 + firstTick) * 15
            const y = scale(secondsPerMile)
            return (
              <Fragment key={i}>
                <line x1={0} x2={-5} y1={y} y2={y} style={{ stroke: 'white' }} />
                {
                  (i % 2) !== 0 && (
                    <text x={-7} y={y + (fontSize * 0.3)} style={{ fill: 'white', textAnchor: 'end', fontSize }}>
                      {secondsToTime(secondsPerMile)}/mi
                    </text>
                  )
                }
              </Fragment>
            )
          })
        }
      </g>
    </g>
  )
}

export default PaceChart

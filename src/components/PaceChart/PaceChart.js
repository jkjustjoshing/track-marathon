import React from 'react'
import { pace, duration } from '../../utils'
import { scaleLinear, line, max, curveMonotoneX } from 'd3'

const WIDTH = 200
const HEIGHT = 200

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

  const xScale = scaleLinear().domain([0, data.goal]).range([0, WIDTH])
  const yScale = scaleLinear().domain([0, max(laps, l => l.pace)]).range([0, HEIGHT])
  const linePath = line()
    .x(d => xScale(d.distance))
    .y(d => yScale(d.pace))
    .curve(curveMonotoneX)

  return (
    <svg viewBox={`0 0 ${WIDTH + 10} ${HEIGHT + 10}`} width={WIDTH + 10} height={HEIGHT + 10}>
      <g transform={`translate(5, 5)`}>
        <XAxis scale={xScale} />
        <YAxis scale={xScale} />

        <path d={linePath(laps)} style={{
          stroke: 'white',
          fill: 'transparent'
        }} />
      </g>
    </svg>
  )
}

const XAxis = ({ scale }) => {
  return (
    <g data-x-axis transform={`translate(0, ${HEIGHT})`}>
      <line x1={0} x2={WIDTH} y1={0} y2={0} style={{ stroke: 'white' }} />
      <g data-ticks>
        {
          scale.ticks(5).map(item => (
            <line key={item} x1={scale(item)} x2={scale(item)} y1={0} y2={5} style={{ stroke: 'white' }} />
          ))
        }
      </g>
    </g>
  )
}

const YAxis = ({ scale }) => {
  return (
    <g data-y-axis transform={`translate(0, 0)`}>
      <line x1={0} x2={0} y1={0} y2={HEIGHT} style={{ stroke: 'white' }} />
      <g data-ticks>
        {
          scale.ticks(5).map(item => (
            <line key={item} x1={0} x2={-5} y1={scale(item)} y2={scale(item)} style={{ stroke: 'white' }} />
          ))
        }
      </g>
    </g>
  )
}

export default PaceChart

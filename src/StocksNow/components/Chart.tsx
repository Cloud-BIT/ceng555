
import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart as Char,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize,
} from 'react-financial-charts';
import { useEffect } from 'react';

interface Props {
  data: Array<DataObject>;
  height: number;
  dateTimeFormat?: string;
  width: number;
  ratio: number;
}

export interface DataObject {
  timestamp: number;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

const Chart: React.FC<Props> = ({ data: initialData, dateTimeFormat = '%c', height, ratio, width }) => {
  const margin = { left: 0, right: 48, top: 12, bottom: 24 };
  const pricesDisplayFormat = format('.2f');
  const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: DataObject) => new Date(d.timestamp * 1000));

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d: any, c: any) => {
      d.ema12 = c;
    })
    .accessor((d: any) => d.ema12);

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 136 })
    .merge((d: any, c: any) => {
      d.ema26 = c;
    })
    .accessor((d: any) => d.ema26);

  const elder = elderRay();

  const calculatedData = elder(ema26(ema12(initialData)));

  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];

  const gridHeight = height - margin.top - margin.bottom;

  const elderRayHeight = 100;
  const elderRayOrigin = (_: number, h: number) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const barChartOrigin = (_: number, h: number) => [0, h - barChartHeight - elderRayHeight];
  const chartHeight = gridHeight - elderRayHeight;

  const timeDisplayFormat = timeFormat(dateTimeFormat);

  const barChartExtents = (data: DataObject) => {
    return data.volume;
  };

  const candleChartExtents = (data: DataObject) => {
    return [data.high, data.low];
  };

  const yEdgeIndicator = (data: DataObject) => {
    return data.close;
  };

  const volumeColor = (data: DataObject) => {
    return data.close > data.open ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
  };

  const volumeSeries = (data: DataObject) => {
    return data.volume;
  };

  const openCloseColor = (data: DataObject) => {
    return data.close > data.open ? '#26a69a' : '#ef5350';
  };

  return (
    <>
      <ChartCanvas
        clamp={false}
        height={height}
        ratio={ratio}
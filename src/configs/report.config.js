export const timeLineOpts = [{
        value: 'TODAY',
        label: 'Hôm nay',
    },
    {
        value: 'YESTERDAY',
        label: 'Hôm qua',
    },
    {
        value: 'LAST_7_DAYS',
        label: '7 ngày trước',
    },
    {
        value: 'THIS_MONTH',
        label: 'Tháng này',
    },
    {
        value: 'SPECIFIC',
        label: 'Tự ấn định',
    },
];

export const timeTypeOpts = [{
        value: 'HOUR',
        label: 'Giờ',
        name: 'Hours',
    },
    {
        value: 'DATE',
        label: 'Ngày',
        name: 'Date',
    },
    {
        value: 'MONTH',
        label: 'Tháng',
        name: 'Month',
    },
    {
        value: 'YEAR',
        label: 'Năm',
        name: 'FullYear',
    },
];

export const chartConfig = {
    emphasis: {
        scale: true,
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            show: true,
            interval: 'auto',
            rotate: 45,
        },
        axisTick: {
            show: true,
            interval: 0
        }
    },
    yAxis: {
        type: 'value',
    },
    series: [{
        type: 'line',
    }],
    tooltip: {
        trigger: 'item',
    },
    grid: {
        containLabel: true,
        bottom: 100,
    },
};
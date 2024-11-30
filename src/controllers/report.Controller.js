import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import { chartConfig, timeLineOpts, timeTypeOpts } from '../configs/report.config.js';
import { datetimeUtil } from '../utils/datetime.util.js';
import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import { getAllOrders } from '../services/Order.Service.js';

//Lấy danh sách giao dịch
export const getAllTransactionsController = async(req, res) => {
    const limit = req.query.limit
    const page = req.query.page
    const queryString = req.query

    const result = await getAllOrders(limit, page, queryString)

    if (result) {
        // Gửi kết quả dưới dạng JSON với danh sách đơn hàng
        return res.json({ success: true, transactions: result });
    } else {
        // Xử lý lỗi nếu không lấy được danh sách đơn hàng
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng' });
    }
}


export const getRevenueAndProfitApi = async(req, res) => {
    try {
        const payments = await Payment.find({}).lean();
        const products = await Product.find({}).lean();

        let totalRevenue = 0;
        let totalProfit = 0;

        for (const payment of payments) {
            const orderDetails = await OrderDetail.find({ orderId: payment.orderId }).lean();
            for (const detail of orderDetails) {
                const product = products.find(p => p._id.equals(detail.productId));
                if (product) {
                    const importPrice = product.importPrice;
                    const sellPrice = detail.price;
                    totalRevenue += sellPrice * detail.quantity;
                    totalProfit += (sellPrice - importPrice) * detail.quantity;
                }
            }
        }
        return res.json({
            totalRevenue,
            totalProfit
        });
    } catch (error) {
        console.error('Error fetching revenue and profit:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getReportView = async(req, res) => {
    const {
        timeLine = timeLineOpts[0]?.value,
            timeType = timeTypeOpts[0]?.value,
            from = '',
            to = '',
    } = req.query;
    const limit = req.query.limit
    const page = req.query.page
    const queryString = req.query

    const result = await getAllOrders(limit, page, queryString)

    if (result) {
        return res.render('reports/listReport', {
            orders: result,
            timeLineOpts: timeLineOpts.map(e => ({
                ...e,
                selected: e.value === timeLine,
            })),
            timeTypeOpts: timeTypeOpts.map(e => ({
                ...e,
                selected: e.value === timeType,
            })),
            timeLine,
            from,
            to,
            isAdmin: req?.cookies?.account === 'admin',
        })
    }
};

export const getReportApi = async(req, res) => {
    const {
        timeLine = timeLineOpts[0]?.value,
            timeType = timeTypeOpts[0]?.value,
            from = '',
            to = '',
    } = req.query;

    const range = getDateRange(timeLine, new Date(from), new Date(to));

    const timeRange = getTimeRange(timeType, range.from, range.to);

    const transactions = await Order.find({
        createdAt: {
            $gt: range.from,
            $lt: range.to,
        }
    }).lean();

    const xAxisData = timeRange.map(e => e.label);
    const chartData = timeRange.reduce((pre, curr) => {
        const trans = transactions.filter(e => e.createdAt >= curr.from.getTime() && e.createdAt < curr.to.getTime());

        return {
            transaction: [...pre.transaction, trans.length],
            product: [...pre.product, trans.reduce((pre, curr) => pre + curr.products?.length, 0)],
        };
    }, {
        transaction: [],
        product: [],
    });

    const customers = await Customer.find({}).lean();

    const chart = {
        transaction: {...chartConfig },
        product: {...chartConfig }
    };
    chart.transaction.series[0].data = chartData.transaction;
    chart.product.series[0].data = chartData.product;
    chart.transaction.xAxis.data = xAxisData;
    chart.product.xAxis.data = xAxisData;

    return res.json({
        chart,
        transactions: transactions?.map(e => ({
            ...e,
            customer: customers?.find(e1 => e1?.phone === e?.customer),
        })),
    });
};

function getDateRange(timeLine, from, to) {
    switch (timeLine) {
        default:
            case 'TODAY':
        {
            const now = new Date();

            return {
                from: datetimeUtil.getStartDate(now),
                to: now,
            };
        }
        case 'YESTERDAY':
            {
                const now = new Date();
                const yesterday = now.setDate(now.getDate() - 1);

                return {
                    from: datetimeUtil.getStartDate(yesterday),
                    to: datetimeUtil.getEndDate(yesterday),
                };
            }
        case 'LAST_7_DAYS':
            {
                const now = new Date();

                return {
                    from: datetimeUtil.getStartDate(now.setDate(now.getDate() - 8)),
                    to: datetimeUtil.getEndDate(now.setDate(now.getDate() - 1)),
                };
            }
        case 'THIS_MONTH':
            {
                const now = new Date();
                const from = datetimeUtil.getStartMonth(now);
                const to = now;

                return {
                    from,
                    to,
                };
            }
        case 'SPECIFIC':
            {
                return {
                    from: datetimeUtil.getStartDate(from),
                    to: datetimeUtil.getEndDate(to),
                };
            }
    }
}

function getTimeRange(timeType, from, to) {
    const timeRange = [];

    const funcName = ((name) => ({
        set: `set${name}`,
        get: `get${name}`,
    }))(timeTypeOpts.find(e => e.value === timeType).name);
    const toTime = new Date(to).getTime();
    const curr = new Date(from)
    while (curr.getTime() < toTime) {
        const from = new Date(curr);
        curr[funcName.set](curr[funcName.get]() + 1)
        timeRange.push({
            label: getLabel(timeType, from),
            from,
            to: new Date(curr.getTime() - 1000),
        });
    }

    return timeRange;
}

function getLabel(timeType, date) {
    const dateFormat = new Date(date);
    let result = '';
    switch (timeType) {
        default:
            case 'HOUR':
            result += `${String(dateFormat.getHours()).padStart(2, '0')}:00 `;
        break;
        case 'DATE':
                result += `${String(dateFormat.getDate()).padStart(2, '0')}/`;
            break;
        case 'MONTH':
                result += `${String(dateFormat.getMonth() + 1).padStart(2, '0')}/`;
            break;
        case 'YEAR':
                result += dateFormat.getFullYear();
            break;
    }
    return result;
}
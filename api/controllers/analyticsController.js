const analysticsModel = require('../models/analyticsModel');

const getAnalytics = async (req, res) => {
    try {
        const result = {
            "totalEarnings":await analysticsModel.getTotalAmountFromSales(),
            "totalProducts":await analysticsModel.getTotalProducts(),
            "totalCustomers":await analysticsModel.getTotalCustomers(),
            "totalSales":await analysticsModel.getTotalSales()
        };
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getMonthlyTotalSales = async (req, res) => {
    try {
        const result = await analysticsModel.getMonthlyTotalSales();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getWeeklyTotalSales = async (req, res) => {
    try {
        const result = await analysticsModel.getWeeklyTotalSales();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getYearlyTotalSales = async (req, res) => {
    try {
        const result = await analysticsModel.getYearlyTotalSales();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = { getAnalytics, getMonthlyTotalSales, getWeeklyTotalSales, getYearlyTotalSales };
const db = require('../config/db');

const getSupplyDetails = async () => {
    const [result] = await db.query("SELECT * FROM supplydetails ORDER BY SupplyDetail_ID ASC");
    return result;
};

const getSupplyDetailsBySupplyId = async (supplyId) => {
    const [result] = await db.query("SELECT * FROM supplydetails WHERE Supply_ID = ?", [supplyId]);
    return result;
};

const getSupplyDetailsByBarCode = async (barCode) => {
    const [result] = await db.query("SELECT * FROM supplydetails WHERE Bar_Code = ?", [barCode]);
    return result;
};

const getSupplyDetailById = async (supplyDetailId) => {
    const [result] = await db.query("SELECT * FROM supplydetails WHERE SupplyDetail_ID = ?", [supplyDetailId]);
    return result[0];
};

const editSupplyDetailById = async (supplyDetailId, quantity, unitPrice, expiry) => {
    const [result] = await db.query("UPDATE supplydetails SET Quantity = ?, Unit_Price = ?, Expiry = ? WHERE SupplyDetail_ID = ?", [quantity, unitPrice, expiry, supplyDetailId]);
    return result.affectedRows > 0;
};

const deleteSupplyDetailById = async (supplyDetailId) => {
    const [result] = await db.query("DELETE FROM supplydetails WHERE SupplyDetail_ID = ?", [supplyDetailId]);
    return result.affectedRows > 0;
};

const addSupplyDetail = async (supplyId, barCode, quantity, unitPrice, expiry) => {
    const [result] = await db.query("INSERT INTO supplydetails (Supply_ID, Bar_Code, Quantity, Unit_Price, Expiry) VALUES (?,?,?,?,?)", [supplyId, barCode, quantity, unitPrice, expiry]);
    const [product] = await db.query("SELECT Inventory_Quantity FROM productvariant WHERE Bar_Code = ?", [barCode]);
    const newQuantity = product[0].Inventory_Quantity + quantity;
    await db.query("UPDATE productvariant SET Inventory_Quantity = ? WHERE Bar_Code = ?", [newQuantity, barCode]);

    return result.insertId;
};

module.exports = {
    getSupplyDetails,
    getSupplyDetailsBySupplyId,
    getSupplyDetailsByBarCode,
    getSupplyDetailById,
    editSupplyDetailById,
    deleteSupplyDetailById,
    addSupplyDetail
};

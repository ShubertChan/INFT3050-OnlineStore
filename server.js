// server.js (Node.js 后端 API 示例框架)
const express = require('express');
const app = express();
app.use(express.json()); // 允许解析 JSON 数据

// 接收前端发来的更新用户请求
app.put('/api/admin/users/:id', (req, res) => {
    const userId = req.params.id;
    const { address, postcode, state } = req.body;

    // 后端双重安全验证 (Double Validation for Security)
    const addressRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\s]+$/;
    const postcodeRegex = /^\d+$/;

    if (!addressRegex.test(address)) {
        return res.status(400).json({ error: "Address must contain letters and numbers." });
    }
    if (!postcodeRegex.test(postcode)) {
        return res.status(400).json({ error: "Postcode must be numbers only." });
    }

    // TODO: 这里写连接 SQL Server 的 UPDATE 语句
    // const sql = `UPDATE TO SET StreetAddress = '${address}', PostCode = '${postcode}' WHERE customerID = ${userId}`;
    
    res.json({ message: "User updated successfully in Database!" });
});

app.listen(5000, () => {
    console.log("Backend Server running on port 5000");
});
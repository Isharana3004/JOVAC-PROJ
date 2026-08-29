require("dotenv").config();

const express = require("express");
const cors = require("cors");

const searchRoutes = require("./routes/search.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SoleDeal Backend is running 🚀"
    });
});

app.use("/api", searchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `SoleDeal Backend running on http://localhost:${PORT}`
    );
});
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");

const authRoutes = require("./routes/auth");
const ownerRoutes = require("./routes/owner");
const userRoutes = require("./routes/user");

const app = express();

// ============================
//  MIDDLEWARE
// ============================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ============================
//  SWAGGER DOCUMENTATION
// ============================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ============================
//  ROUTES
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/user", userRoutes);

// ============================
//  CONNECT DATABASE AND START SERVER
// ============================
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
  });

// ============================
//  GLOBAL ERROR HANDLER (Optional)
// ============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

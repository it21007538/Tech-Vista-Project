const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const client = require("prom-client"); //Matric Collection
const responseTime = require("response-time"); // custom matric
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

dotenv.config();
app.use(express.json());

//Matric Collection
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({register: client.register});

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

// custom matric
const reqResTime = new client.Histogram({
  name: "http_express_req_res_time",
  help: "This tells how much tme is taken by req and res",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 500, 800, 1000, 2000],
});

// custom matric 2
const totalRequest = new client.Counter({
  name: "http_express_total_request",
  help: "This tells total request made to the server",
  labelNames: ["method", "route", "status_code"],
});

app.use(responseTime((req, res, time) => {
    totalRequest.inc();
    reqResTime.labels
    ({method:req.method, 
        route:req.url, 
        status_code:res.statusCode
    })
    .observe(time);
}));

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.send("Hello from Express Server");
});

const userRouter = require("./routes/userRoutes");
app.use("/api/user", userRouter);

const bookingRouter = require("./routes/bookingRoutes");
app.use("/api/booking", bookingRouter);

const trainRouter = require("./routes/trainRoutes");
app.use("/api/train", trainRouter);

const paymentRouter = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRouter);

const lostItemRouter = require("./routes/lostItemRoutes");
app.use("/api/lostItem", lostItemRouter);


const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
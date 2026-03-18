if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const User = require("./models/user.js");

const app = express();
const port = process.env.PORT || 8080;

let isConnectedToDb = false;

async function connectDB() {
  if (isConnectedToDb) {
    return mongoose.connection;
  }

  const dbURL = process.env.ATLASDB_URL;
  if (!dbURL) {
    throw new Error("ATLASDB_URL is not set. Add it to your environment variables.");
  }

  await mongoose.connect(dbURL);
  isConnectedToDb = true;
  console.log("Connected to DB");
  return mongoose.connection;
}

// Trust proxy on Vercel
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const dbURL = process.env.ATLASDB_URL;
const sessionSecret = process.env.SECRET || "change-this-secret";

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: sessionSecret,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Mongo session store", err);
});

const sessionOptions = {
  store,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Catch-all for unmatched routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not Found! Due to wrong URL "));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  try {
    res.status(statusCode).render("error.ejs", { err: { ...err, message } });
  } catch (renderErr) {
    console.error("Error rendering error page:", renderErr);
    res.status(statusCode).json({ error: message });
  }
});

if (require.main === module) {
  connectDB().catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = { app, connectDB };

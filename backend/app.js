const optionsRoute = require("./routes/options.route");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors=require('cors');
const corsOptions={
    origin: '*',
};
const authRouter = require("./routes/auth.route");
const registerRouter=require("./routes/register.route");
const companyRouter = require("./routes/company.route");
const departmentRouter = require("./routes/department.route");
const projectRouter = require("./routes/project.route");
const chartRoute = require("./routes/chart.route");
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app level
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//route level
app.use('/register', registerRouter);
app.use("/company", companyRouter);
app.use("/department", departmentRouter);
app.use("/project", projectRouter);
app.use('/auth', authRouter);
app.use("/options", optionsRoute);
app.use("/chart", chartRoute);
//http://localhost/register
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const express = require("express");
const {connect} = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const upload = require("express-fileupload")
const os = require("os")
const {notFound, errorHandler} = require("./middleware/errorMiddleware")
const routes = require('./routes/routes')
const {server, app} = require("./socket/socket")


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({credentials: true, origin: ["http://localhost:5173"]}))
app.use(upload({ useTempFiles: true, tempFileDir: os.tmpdir() }))

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URL).then(() => {
  server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
}).catch((err) => console.log(err))
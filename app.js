require('dotenv').config()
const express = require("express");
const app = express();


if (process.env.NODE_ENV === "production") {
    app.use(express.static("build"));
    app.get("*", (req, res) => {
        const path = require("path");
        console.log("We're running the front-end in production mode")
        res.sendFile(path.resolve(__dirname, "build", "index.html"));
    });
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log("Server is listening on PORT ", PORT);
    });
} else {
    console.log("not production... ENV is: ", process.env.NODE_ENV)
}


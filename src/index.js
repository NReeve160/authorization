console.log('Starting index.js...');

const express = require('express');
const path = require('path');
const bcrypt = require ('bcrypt');
const collection = require("./config");
const app = express();

//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// use EJS as a view engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/login', (req, res) => {
    res.render('login', {}, (err, html) => {
        if (err) {
            console.error('Error rendering login.ejs:', err);
            res.status(500).send('An error occurred');
        } else {
            ///console.log('Rendered HTML:', html);
            res.send(html); // Send the rendered HTML explicitly
        }
    });
});

app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send("Username cannot be found");
        }

        //compare the hash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch) {
            res.render("home");
        }else {
            req.send("Incorrect Password");
        }
    }catch{
        res.send("Wrong Details");
    }
});


app.get('/signup', (req, res) => {
    res.render('signup', {}, (err, html) => {
        if (err) {
            console.error('Error rendering signup.ejs:', err);
            res.status(500).send('An error occurred');
        } else {
            ///console.log('Rendered HTML:', html);
            res.send(html); // Send the rendered HTML explicitly
        }
    });
});

app.post("/signup", async (req, res) => {
    console.log("request Body", req.body);
    
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({name: data.name});

    if(existingUser) {
    res.send("User already exists. Please choose another username");
}else {
    // hash the password using bcrypt
    const saltRounds = 10;
    bcrypt.hash("testpassword", saltRounds)
    .then(hash => console.log("Hashed Password:", hash))
    .catch(err => console.error("Bcrypt Error:", err));

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    const userdata = await collection.insertMany([data]);
    console.log(userdata);
    console.log("Original Password:", req.body.password);
    console.log("Hashed Password:", hashedPassword);
    console.log("User Data to Insert:", data);
}
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
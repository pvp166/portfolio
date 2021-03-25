const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const { username, password, recipent } = require('./config.js');

const app = express();
//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', exphbs({
    defaultLayout: "",
    layoutsDir: "",
}
    
));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('contact');
});
app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Phone: ${req.body.phoneNumber}</li>
            <li>Email: ${req.body.email}</li>
            <li>subject: ${req.body.subject}</li>
            
        </ul>
        <h3>Message</h3>
        <p> ${req.body.message}</p>
    `;
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
            user: username,
            pass: password
        }
    });
    let mailOptions = {
        from: `${req.body.name} <${req.body.email}>`,
        to: `${recipent}`,
        subject: `${req.body.subject}`,
        text: 'nothing',
        html: output
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error)
        }
        res.render('contact');
    });
    
})
app.listen(3000, () =>console.log('Server started'));
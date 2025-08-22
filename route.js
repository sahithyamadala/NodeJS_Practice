const express=require('express');
const router=express.Router();
const path=require('path');
const PORT=process.env.PORT||3000;
const app=express();
app.use(router);

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'Files','index.html'));
});
router.get('/hello', (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    res.send('Hello World!');
});
router.all('/chain', (req, res, next) => {
    console.log('one');
    next();
}, (req, res, next) => {
    console.log('two');
    next();
}, (req, res, next) => {            
    console.log('three');
    next();
}, (req, res) => {
    console.log("All middleware executed");
    res.send('Chain of middleware executed');
});    

// Middleware to serve static files will be starting from here
app.use(express.static(path.join(__dirname, 'Files')));
//custom middleware to log request details
router.use((req, res, next) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Time: ${new Date().toISOString()}`);
    
    // You can also log to a file or database here
    // Example: 
    // Log.create({ method: req.method, url: req.url, time: new Date() }, (err) => {
    //     if (err) console.error(err);
    //     console.log('Log message saved');
    // });
    
    next();
});
//built-in middleware to parse urlencoded data
app.use(express.urlencoded({ extended: true })); 

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})
router.route('/')
    .get((req, res) => {
        res.json({
            message: 'GET request to the homepage',
            timestamp: new Date().toISOString()
        });
    })
    .post((req, res) => {
        res.json({
            message: 'POST request to the homepage',
            timestamp: new Date().toISOString()
        });
    })
    .put((req, res) => {
        res.json({
            message: 'PUT request to the homepage',
            timestamp: new Date().toISOString()
        });
    })
    .delete((req, res) => {
        res.json({
            message: 'DELETE request to the homepage',
            timestamp: new Date().toISOString()
        });
    });
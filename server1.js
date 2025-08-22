const express=require('express');
const path=require('path')
const app=express();
const fs=require('fs');
const {Format}=require('date-fns');
const {v4:uuid}=require('uuid');
const cors=require('cors');
const PORT=process.env.PORT||3000;

app.use(cors());

//custom middleware logger
app.use((req,res,next)=>{
    const logMessage=`${new Date().toISOString()} ${uuid()} ${req.method} request for ${req.url} ${req.headers.origin}\n`;
    fs.appendFile(path.join(__dirname,'Logs','LogsList.txt'),logMessage,(err)=>{
        if(err) console.error(err);
        console.log('Log message saved');
    })

    next();
})
//built-in middleware to serve static files
app.use(express.static(path.join(__dirname,'Files')));
//built-in middleware to parse urlencoded data
app.use(express.urlencoded({extended:true}));
//built-in middleware to parse json data
app.use(express.json());
//built-in middleware to parse text data
// app.use(express.text());
// //built-in middleware to parse raw data
// app.use(express.raw());    
// //built-in middleware to parse cookies
// app.use(express.cookieParser());
// //built-in middleware to parse query strings
// app.use(express.query());  
// //built-in middleware to parse multipart/form-data
// app.use(express.multipart());




// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'Files','index.html'));
//     //res.sendFile('Files/index.html',{root:__dirname});
// });
// app.get('/hello(.html)?',
//   (req, res, next) => {
//     console.log('attempted to load hello.html');
//     next();
//   },
//   (req, res) => {
//     res.send('Hello World!');
//   }
// );

// const one=(req,res,next)=>{
//     console.log('one');
//     next();
// }
// const two=(req,res,next)=>{
//     console.log('two');
//     next();
// }
// const three=(req,res,next)=>{
//     console.log('three');
//     next();
// }
// app.get('/chain',[one,two,three],(req,res)=>{
//     console.log("All middleware executed");
//     res.send('Chain of middleware executed');
// })
// // app.get(/^\/chain(\.html)?$/, [one, two, three]);
// //Middleware to serve static files will be starting from here


app.listen(PORT,()=>console.log(`Server running on ${PORT}`));
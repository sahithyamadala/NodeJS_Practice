// const os=require('os');
// const path=require('path');
// const math=require('./math.js');
// const fs=require('fs');

// const fsPromises=require('fs/promises'); // For Node.js v14 and later


// console.log(math.add(5,5));
// console.log(os.type());
// console.log(os.version());
// console.log(os.platform());
// console.log(os.arch());
// console.log(os.homedir());
// console.log(path.dirname(__filename));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));
// const parsedfile=path.parse(__filename);
// console.log(parsedfile);
// console.log(parsedfile.root);
// fs.readFile(path.join(__dirname,'Files','read.txt'),'utf-8',(data,err)=>{
//     if(err){
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// })
// fs.writeFile(path.join(__dirname,'Files','write.txt'),"Hello!!",'utf-8',(err)=>{
//     if(err){
//         console.log(err);
//     } else {
//         console.log("data written");
//     }
// })
// // fs.readFile(path.join(__dirname,'Files','read.txt'),'utf-8',(data,err)=>{
// //     if(err){
// //         console.log(err);
// //     } else {
// //         console.log(data);
// //     }
// // })
// fs.appendFile(path.join(__dirname,'Files','write.txt'),"Nice to meet you",'utf-8',(err)=>{
//     if(err){
//         console.log(err);
//     } else {
//         console.log("data appended");
//     }
// })
// fs.rename(path.join(__dirname,'Files','write.txt'),path.join(__dirname,'Files','newwrite.txt'),(err)=>{
//     if(err){
//         console.log(err);
//     } else {
//         console.log("file renamed");
//     }
// })
// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you.', (err) => {
//   if (err) throw err;
//   console.log('Write complete');

//   fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\nYes, I agree!', (err) => {
//     if (err) throw err;
//     console.log('Append complete');
//   });
// });
// // async function readFile() {
// //   const data = await fs.readFile('example.txt', 'utf8');
// //   console.log(data);
// // }

// // readFile();
// fsPromises.readFile(path.join(__dirname,'Files','read.txt'),'utf-8')
//     .then((data)=>{
//         console.log(data);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });
// fsPromises.unlink(path.join(__dirname,'Files','newwrite.txt'))
//     .then(()=>{
//         console.log("file deleted");
//     })
//     .catch((err)=>{
//         console.log(err);
//     });

// const rs=fs.createReadStream('read.txt',encoding='utf-8')
//     .on("data",(datachunk)=>{
//         console.log("Reading chunk:", datachunk);
//     })
//     .on("end",()=>{
//         console.log("completed reading the file in chunks")
//     })
// const ws=fs.createWriteStream('read.txt',encoding='utf-8');
// ws.write("Hello NodeJS Soon i will learn You completely");
// ws.write("\nI am excited to learn NodeJS");
// ws.end();
// ws.on("finish",()=>{
//     console.log("writing finished in chunks");
// })
// rs.pipe(ws);
// // if(!fs.existsSync('./newdir')){
// //     fs.mkdir('./newdir',(err)=>{
// //     if(err){
// //         console.log(err);
// //     } else {
// //         console.log("Directory created");
// //     }
// // })
// //}
// if(fs.existsSync('./newdir')){
//     fs.rmdir('./newdir',(err)=>{
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Directory removed");
//     }
// })
// }

// // const readStream = fs.createReadStream('input.txt', 'utf8');

// // readStream.on('data', (chunk) => {
// //   console.log('Reading chunk:', chunk);
// // });

// // readStream.on('end', () => {
// //   console.log('Finished reading file.');
// // });

const express = require('express');
const app = express();
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');

app.use(express.json()); // For parsing JSON requests

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.get('/', (req, res) => {
    res.send('Welcome to the User Management System');
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));


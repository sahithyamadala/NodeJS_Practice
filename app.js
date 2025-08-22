const {format} =require('date-fns');
const {v4:uuid}=require('uuid');

const date=new Date();
const formattedDate=format(date,'dd/mm/yyyy');
const userId=uuid();
console.log(formattedDate);
console.log(userId);
//const logEvent=
const mongoose =require('mongoose');

const connectDB=async()=>{
    try{
// mongodb connection string
  const con =await mongoose.connect("mongodb+srv://hello:hello1@blogmanagement.siz0546.mongodb.net/",{
    useNewUrlParser:true,
  })
  console.log(`mongodb connected:${con.connection.host}`);
    }catch(err){
 console.log(err);
 process.exit(1);
    }
}

module.exports=connectDB;

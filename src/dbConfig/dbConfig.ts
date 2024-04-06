import mongoose from "mongoose";


export async function connectDb(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        connection.on('connection',()=>{
            console.log("Db connected");
        });
        connection.on('error',(err)=>{
            console.log('DB connection error'+ err);
            process.exit();
        })
    } catch (error) {
        console.log('Something went error');
        console.log(error);
    }
}
import app from "./app";
import 'dotenv/config'

const PORT = process.env.PORT || 3400

app.listen(PORT,()=>{
    console.log("Listening on port: ",PORT)
})
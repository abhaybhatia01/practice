const fs = require('fs').promises;
(async ()=>{
    //writeMany: 41425.876ms
    // cpu usage : 74%
   // console.time('writeMany')
   // const filehandle = await fs.open("test.txt","w");
    //for(let i=0; i<1000000; i++){
     //   await filehandle.write(` ${i} `)
    //}
    //console.timeEnd('writemany')
    
    // not a good practice
    //writeMany: 899.618ms
    // cpu usage : 
    console.time('writeMany')
    const filehandle = await fs.open("test.txt","w");
    const stream = filehandle.createWriteStream();
    console.log(stream.writableHighWaterMark)
    let i=0
    const buff = Buffer.from(` ${i} `,"utf-8")
    function writeMany(){
        while(i<3000000){
    //        if(i===999999){
    //            return stream.end(buff);
    //        }
            if(!stream.write(buff)){
                break;
            }
            i++;
        }
    }
    let drain=0;
    stream.on('drain',()=>{ 
        console.log(drain++)
        writeMany();
    })
   // stream.on('finish',()=>{ 
   //     filehandle.close();
   // })
    writeMany()
    console.timeEnd('writeMany')
    
})()

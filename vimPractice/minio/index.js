
const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const axios = require('axios');
const port = 3000;
const fs = require('fs')

// Middleware to parse JSON bodies
app.use(express.json());

const credentials = new AWS.SharedIniFileCredentials({ profile: 'default1' });
// AWS.config.credentials = credentials;
// const s3 = new AWS.S3({ computeChecksums: true, signatureVersion: 'v4', region: 'ap-south-1' }); // this is the default setting
// const credentials = new AWS.SharedIniFileCredentials({ profile: 'minio-master' });
AWS.config.credentials = credentials;
        
// Configure the AWS SDK with your credentials and MinIO endpoint
// AWS.config.update();

// Create an S3 instance
const s3 = new AWS.S3({
  // accessKeyId: 'tAAhbVPz4gMYd4PNDURs',  //generated
  // secretAccessKey: 'lXrqhx26RJaSE51L5M6wzMyyWboHWZq58ROXxuo1', // generated 
  region: 'us-east-1', // Specify your region
  // endpoint: 'http://localhost:9000', // MinIO server endpoint
  // s3ForcePathStyle: true, // Required for MinIO
  // signatureVersion: 'v4' // Required for MinIO
  computeChecksums:true
});
s3.listBuckets((err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
      console.log('Buckets listed successfully',data);
  }
});

// Define a route handler for the root path
app.get('/buckets', (req, res) => {
  // Example: List all buckets in MinIO
  s3.listBuckets((err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.send('Error listing buckets');
    } else {
        console.log('Buckets listed successfully');
        res.send(data);
    }
  });
});

app.get('/listObjects', (req, res) => {
    const params = {
      Bucket: 'data' // Specify the bucket name
    };
  
    // Call the listObjects method to list objects in the bucket
    s3.listObjects(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        res.send('Error listing objects in the bucket');
      } else {
        console.log(data.Contents);
        res.json(data.Contents);
      }
    });
})


// Generate pre-signed URLs for uploading and downloading objects
app.get('/getPresignedUrls', (req, res) => {
  const Key = req.query.key
    const params = {
      Bucket: 'faclonpics',
      Key: Key,
      ACL: 'public-read',
      ContentType: 'image/jpeg',
      Metadata: { "Cache-Control": "no-cache" }
    };

    // Generate pre-signed URL for uploading (PUT)
    s3.getSignedUrl('putObject', params, (err, putUrl) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error generating pre-signed PUT URL');
            return;
        }
       
        // Generate pre-signed URL for downloading (GET)
        s3.getSignedUrl('getObject', {
            Bucket: 'faclonpics', 
            Key, 
          }, (err, getUrl) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error generating pre-signed GET URL');
                return;
            }

            // Return both URLs
            res.json({
                uploadUrl: putUrl,
                downloadUrl: getUrl
            });
        });
    });
});

  
  // Upload objects to the pre-signed URL
  app.post('/uploadObject', async (req, res) => {
    try{
      const objectUrl = req.body.objectUrl; // URL obtained from getPresignedUrl
    
      const response = await axios.put(objectUrl, 'Hello World', {
        headers: { 'Content-Type': 'text/plain' }
      });
    
      res.send('Object uploaded successfully');
    }catch(error){
			res.send({ success: false, errors: [error.toString()] });
		}
  });
  
  // Retrieve objects from the pre-signed URL
  app.get('/getObject', async (req, res) => {
    try {
        const objectUrl = req.query.objectUrl; // URL obtained from getPresignedUrl
        const response = await axios.get(objectUrl);

        if (response.status === 200) {
            res.send(response.data);
        } else {
            console.log('Error retrieving object:', response.status, response.data);
            res.status(500).send('Error retrieving object');
        }
    } catch (err) {
        console.error('Error retrieving object:', err.message);
        res.status(500).send('Error retrieving object');
    }
});

app.post('/getUrl',(req,res)=>{
  try{
    console.log('Body:-', req.body);

    // const s3 = require('./../../util/s3/s3Operations').getS3Client();
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'default1' });
    AWS.config.credentials = credentials;
    var s3 = new AWS.S3({ 
      computeChecksums: true ,
      region: 'us-east-1', // Specify your region
      // endpoint: 'http://localhost:9000', // MinIO server endpoint
      // s3ForcePathStyle: true, // Required for MinIO
      // signatureVersion: 'v4' // Required for MinIO}); // this is the default setting
    })
    var params = {
      Bucket: 'faclonpics',
      Key: req.body.filename,
      ACL: 'public-read',
      ContentType: 'image/jpeg',
      Metadata: { "Cache-Control": "no-cache" }
    };
    var signedUrl = s3.getSignedUrl('putObject', params);
    console.log("Signed Url:-", signedUrl);
    res.status(200).json({ success: true, data: signedUrl });
  }catch(error){
    res.send({ success: false, errors: [error.toString()] });
  }
})


app.post("/upload", async (req, res) => {
  try {
      const signedUrl = req.body.signedUrl;
      const photoFilePath = 'testAbhay.pdf';
      
      const buffer = fs.readFileSync(photoFilePath);

      const response = await axios.put(signedUrl, buffer, {
          headers: {
              // 'Content-Type': 'image/jpeg',
              'Content-Type': 'application/pdf',
          },
      });

      console.log('Photo uploaded successfully:', response.data);
      res.send({ success: true, status: response.status });
  } catch (error) {
      console.error('Error uploading photo:', error);
      res.status(500).send({ success: false, error: error.message });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


// const s3Client = new S3Client({
//     //   credentials: fromIni({ profile: 'YOUR_AWS_PROFILE' }), // Use your AWS profile
//         accessKeyId: 'tAAhbVPz4gMYd4PNDURs',
//         secretAccessKey: 'lXrqhx26RJaSE51L5M6wzMyyWboHWZq58ROXxuo1',
//         region: 'minio-region', // Specify your AWS region
//         endpoint: 'http://localhost:9000', // MinIO server endpoint
//         s3ForcePathStyle: true, // Required for MinIO
//         signatureVersion: 'v4' // Required for MinIO
//     });




const getAWSS3Url = async (req, res) => {
  try {
      const { Bucket, Expires } = req.body
      // change type to extension in front end
      const extension = req.params.type == 'xlsx' ? 'xlsx' : 'pdf';
      const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
      // AWS.config.credentials = credentials;
      // const s3 = new AWS.S3({ computeChecksums: true, signatureVersion: 'v4', region: 'ap-south-1' }); // this is the default setting
      // const credentials = new AWS.SharedIniFileCredentials({ profile: 'minio-master' });
      AWS.config.credentials = credentials;
      const s3 = new AWS.S3({
          endpoint: process.env.MINIO_S3_URL,
          s3ForcePathStyle: true,
          computeChecksums: true,
          signatureVersion: 'v4',
          region: 'ap-south-1'
      });
      console.log('S3 Credentials = ', credentials);

      const signedUrl = await s3.getAWSS3Url('getObject', {
          Bucket,
          Key: `${req.params.filename}.${extension}`,
          Expires
      });
      console.log('Report to download:-', signedUrl);

      res.send({ success: true, data: signedUrl });
  } catch (error) {
      res.send({ success: false, errors: [error] });
  }
};
const im = require('imagemagick');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuid/v4');
const {promisify} = require('util');
const AWS = require('aws-sdk');

// Convert resize function im.image to a async function which is used with await below
const resizeAsync = promisify(im.resize);
// Convert readFile function fs.readFile to a async function which is used with await below
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

AWS.config.update({region: 'ap-southeast-2'});
const s3 = new AWS.S3();

exports.handler = async (event) => {

    let filesProcessed = event.Records.map( async (record) => {
        let bucket = record.s3.bucket.name;
        let filename = record.s3.object.key;
        console.log('Filename', filename);
        // Get file from S3
        var params = {
            Bucket: bucket,
            Key: filename
        };
        let inputData = await s3.getObject(params).promise();

        // Resize the file
        let tempFile = os.tmpdir() + '/' + uuidv4() + '.jpg';
        let resizeArgs = {
            srcData: inputData.Body,
            dstPath: tempFile,
            width: 150
        };
        await resizeAsync(resizeArgs);

        // Read the resized file
        let resizedData = await readFileAsync(tempFile);
        
        // Upload the new file to s3
        let targetFilename = filename.substring(0, filename.lastIndexOf('.')) + '-smail.jpg';
        let destBucket = bucket.substring(0, bucket.lastIndexOf('-src')) + '-dest';
        console.log('Dest Bucket', destBucket)

        var params = {
            Bucket: destBucket,
            Key: targetFilename,
            Body: new Buffer(resizedData),
            ContentType: 'image/jpeg',
        };

        await s3.putObject(params).promise();
        return await unlinkAsync(tempFile);

    });

    await Promise.all(filesProcessed);
    console.log("done");
    return "done"
}
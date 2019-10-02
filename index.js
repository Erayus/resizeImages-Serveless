const im = require('imagemagick');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuid/v4');
const {promisify} = require('util');
const AWS = require('aws-sdk');

// Convert resize function im.image to a async function which is used with await below
const resizeAsync = promisify(im.resize);

AWS.config.update({region: 'ap-southeast-2'});
const s3 = new AWS.S3();

exports.handler = async (event) => {

    let filesProcessed = event.Records.map( async (record) => {
        let bucket = record.s3.bucket.name;
        let filename = record.s3.object.key;

        // Get file from S3
        var params = {
            Bucket: bucket,
            Key: filename
        }
        let inputData = await s3.getObject(params).promise();

        // Resize the file
        let tempFile = os.tempdir() + '/' + uuidv4() + '.jpg';
        let resizeArgs = {
            srcData: inputData.Body,
            dstPath: tempFile,
            width: 150
        };
        await resizeAsync(resizeArgs);

        // Read the resized file

        
    });

    await Promise.all(filesProcessed);
    console.log("done");
    return "done"
}
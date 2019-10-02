const im = require('imagemagick');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuid/v4');
const {promisify} = require('util');
const AWS = require('aws-sdk');

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
        // Resize the file

        // Read the resized file
    });

    await Promise.all(filesProcessed);
    console.log("done");
    return "done"
}
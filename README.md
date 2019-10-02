# Resize-Images Serveless
## Description
This project allow the user to upload the a huge image to a S3 bucket and received its resized image on another s3 bucket. 

## Technology components
1. A Lambda function: To perform the resizing.
2. Two S3 buckets
  - Upload bucket: where the image that needs to be resized is uploaded to
  - Destination bucket: where the resized image is put it.

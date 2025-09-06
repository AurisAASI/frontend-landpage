# Deployment to AWS S3

This guide explains how to deploy the static site to AWS S3 and configure CloudFront for content delivery.

## Prerequisites

1. An AWS account
2. AWS CLI installed and configured with appropriate permissions
3. A built version of your site (run `npm run build`)

## Deployment Steps

### 1. Create an S3 Bucket

```bash
aws s3 mb s3://your-bucket-name --region your-region
```

Replace `your-bucket-name` with a globally unique bucket name and `your-region` with your desired AWS region.

### 2. Configure the S3 Bucket for Website Hosting

```bash
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

### 3. Set Bucket Policy for Public Access

Create a file named `bucket-policy.json` with the following content:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
```

### 4. Upload Files to S3

```bash
aws s3 sync build/ s3://your-bucket-name --delete
```

This will upload all files from your `build` directory to the S3 bucket.

### 5. (Optional) Set up CloudFront

For better performance and HTTPS support, you can set up a CloudFront distribution:

1. Go to AWS CloudFront console
2. Create a new distribution
3. Use your S3 website endpoint as the origin
4. Configure the following settings:
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Compress Objects Automatically: Yes
   - Default Root Object: index.html
   - Configure Error Pages to redirect to /index.html for 403 and 404 errors (for SPA routing)

### 6. Set up Proper Cache Control Headers

When deploying updates, use the following command to set appropriate cache headers:

```bash
# For static assets with hash in filename (long cache)
aws s3 sync build/ s3://your-bucket-name --delete --exclude "*" --include "*.js" --include "*.css" --include "images/*" --cache-control "max-age=31536000, public" --metadata-directive REPLACE

# For HTML and other files that might change (short cache)
aws s3 cp build/index.html s3://your-bucket-name/index.html --cache-control "max-age=0, no-cache, no-store, must-revalidate" --content-type "text/html" --metadata-directive REPLACE
aws s3 cp build/robots.txt s3://your-bucket-name/robots.txt --cache-control "max-age=86400, public" --content-type "text/plain" --metadata-directive REPLACE
```

### 7. Automate Deployment with GitHub Actions

To automate the deployment process, you can create a GitHub Actions workflow file in `.github/workflows/deploy.yml`:

```yaml
name: Deploy to S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build website
        run: npm run build
        
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: |
          aws s3 sync build/ s3://your-bucket-name --delete
          
      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

Remember to set up the repository secrets in GitHub:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- CLOUDFRONT_DISTRIBUTION_ID

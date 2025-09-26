#!/bin/bash
echo "Building TaskMaster Backend..."
npm run build

echo "Creating deployment package..."
cd dist
zip -r ../taskmaster-backend.zip .
cd ..

echo "✅ Backend built and packaged for deployment"

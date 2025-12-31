#!/bin/bash
cd /home/kavia/workspace/code-generation/fashion-commerce-platform-227183-227193/fashion_website_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


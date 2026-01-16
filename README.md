# OpenRouter Qwen3 VL

## Description
OpenRouter Qwen3 VL is a project that utilizes the OpenRouter API to encode images and PDFs into Base64 format. This project leverages the LangChain library to interact with the OpenAI models.

## Features
- Encode images to Base64
- Encode PDFs to Base64
- Utilizes OpenAI's ChatGPT model for processing

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd openrouter-qwen3-vl
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```plaintext
OPENROUTER_API_KEY="your_api_key"
FILE_PATH="path_to_your_pdf"
IMAGE_PATH="path_to_your_image"
MODEL_NAME="qwen/qwen3-vl-235b-a22b-instruct"
```

## Usage
To start the application, run:
```bash
npm start
```

## Scripts
- `start`: Runs the application.
- `format`: Formats the code using Prettier.
- `format:check`: Checks the code formatting.

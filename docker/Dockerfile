FROM node:20-alpine

ARG awsKey
ARG awsSecret
ARG awsSessionToken

RUN apk update
RUN apk upgrade

RUN yarn global add serverless@3

RUN serverless config credentials --provider aws --key ${awsKey} --secret ${awsSecret}
RUN echo "aws_session_token=${awsSessionToken}" >> ~/.aws/credentials

WORKDIR /app

COPY package*.json yarn.lock* ./
RUN yarn install

COPY . .

CMD ["yarn", "dev"]
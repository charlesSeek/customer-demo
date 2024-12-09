# Customer App demo

It is code challenge to set up customer app, which including backend API and front ui. 

## System Design

- **Frontend**
we use create-react-app to set up react app scaffold
and the bundle package is hosted on S3 bucket.
We use react context + reducer as state management.
- **Backend**
we use aws serverless to implement our customer api, including API Gateway and Lambda function. we use json
data for our datasource. In the future, we could use dynamodb / RDS to store customer data.
- **AWS deploy**
we use terraform to manage and deploy aws service, including S3, API Gateway, Lambda function, IAM

## Repository structure
/
|- /api           # Backend source files
|- /ui            # Frontend source files
|- main.tf        # terraform configure
|- .github        # CI/CD pipeline configure
|- README.md   

## Instruction

### Backend
```bash
$ cd api    
$ yarn
$ yarn test       # run api unit tests
$ yarn package    # package lambda zip file
$ terraform init
$ terraform apply # deploy aws service

**API endpoint**
https://zbqkw071ce.execute-api.ap-southeast-2.amazonaws.com/dev/customers?pageSize=10&page=0

- search: search term
- pageSize: number
- page: number, from 0
- order: desc or acs
- startDate: string(YYYY-MM-DD) like '2024-01-01'
- endDate: string(YYYY-MM-DD), like '2024-12-10'

### Frontend
```bash
$ cd ui
$ yarn
$ yarn test       # run api unit tests
$ yarn start      # start local

**UI endpoint**
http://customers-d8ef89cc58dd845d.s3-website-ap-southeast-2.amazonaws.com/




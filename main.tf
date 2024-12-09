provider "aws" {
  profile = "demo"
  region = "ap-southeast-2"
}

resource "random_id" "bucket_id" {
  byte_length = 8
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "get_customers" {
  filename         = "lambda_get_customers.zip"
  function_name    = "get_customers"
  role             = aws_iam_role.lambda_role.arn
  handler          = "dist/get_customers.handler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("lambda_get_customers.zip")
  timeout          = 30
}

resource "aws_cloudwatch_log_group" "get_customers" {
  name = "/aws/lambda/${aws_lambda_function.get_customers.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "api_gateway_cloudwatch_role" {
  name = "APIGatewayCloudWatchLogsRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "apigateway.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "api_gateway_cloudwatch_policy" {
  name   = "APIGatewayCloudWatchLogsPolicy"
  role   = aws_iam_role.api_gateway_cloudwatch_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:PutLogEvents",
        "logs:GetLogEvents",
        "logs:FilterLogEvents"
      ],
      Resource = "*"
    }]
  })
}

resource "aws_apigatewayv2_api" "customer_api" {
  name        = "CustomerAPI"
  protocol_type = "HTTP"
  description = "API for customer information"
}

resource "aws_api_gateway_account" "api_gateway_account" {
  cloudwatch_role_arn = aws_iam_role.api_gateway_cloudwatch_role.arn
}

resource "aws_cloudwatch_log_group" "api_gw_log_group" {
  name = "/aws/apigateway/customer-api"
}

resource "aws_apigatewayv2_stage" "customer_api_stage" {
  api_id = aws_apigatewayv2_api.customer_api.id
  name = "dev"
  auto_deploy = true
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw_log_group.arn
    format = jsonencode({
      requestId: "$context.requestId",
      ip: "$context.identity.sourceIp",
      requestTime: "$context.requestTime",
      protocol: "$context.protocol",
      httpMethod: "$context.httpMethod",
      resourcePath: "$context.resourcePath",
      routeKey: "$context.routeKey",
      status: "$context.status",
      responseLength: "$context.responseLength"
      integrationErrorMessage: "$context.integrationErrorMessage"
    })
  }
}

resource "aws_apigatewayv2_integration" "customer_integration" {
  api_id = aws_apigatewayv2_api.customer_api.id
  integration_uri = aws_lambda_function.get_customers.invoke_arn
  integration_type = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_customers" {
  api_id = aws_apigatewayv2_api.customer_api.id
  route_key = "GET /customers"
  target = "integrations/${aws_apigatewayv2_integration.customer_integration.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_customers.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.customer_api.execution_arn}/*/*"
}

output "api_url" {
  value = aws_apigatewayv2_stage.customer_api_stage.invoke_url
}

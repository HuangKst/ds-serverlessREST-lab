import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const movieId = event.pathParameters?.movieId;
    if (!movieId) {
      return { statusCode: 400, body: JSON.stringify({ message: "Movie ID required" }) };
    }

    await ddbDocClient.send(new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: parseInt(movieId) },
    }));

    return { statusCode: 200, body: JSON.stringify({ message: "Movie deleted" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error }) };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-central-1" });
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoDBHelper {
  static async getItem(tableName: string, key: any) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
    const response = await docClient.send(command);
    return response.Item;
  }

  static async putItem(tableName: string, item: any) {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });
    await docClient.send(command);
    return item;
  }

  static async updateItem(tableName: string, key: any, updateExpression: string, expressionValues: any) {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
    });
    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async deleteItem(tableName: string, key: any) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });
    await docClient.send(command);
    return { success: true };
  }

  static async query(tableName: string, keyCondition: string, expressionValues: any, indexName?: string) {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionValues,
      IndexName: indexName,
    });
    const response = await docClient.send(command);
    return response.Items || [];
  }
}

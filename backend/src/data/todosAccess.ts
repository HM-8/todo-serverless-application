import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';
var AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable: string = process.env.TODOS_TABLE,
        private readonly todosIndex: string = process.env.INDEX_NAME
    )
    { }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem>{
        logger.info('createTodoItem')
        const result = await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem,
        }).promise()
        logger.info('createTodoItem result', result)
        return todoItem
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('getTodosForUser')
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        logger.info('getTodosForUser result', result)
  async updateTodoItem(
    userId: string,
    todoId: string,
    updatedTodo: TodoUpdate
  ): Promise<TodoUpdate> {
    logger.info('updateTodoItem data access')

    try {
      const result = await this.docClient
        .update({
          TableName: this.todosTable,
          Key: {
            userId,
            todoId
          },
          UpdateExpression:
            'set #name = :name, dueDate = :dueDate, done = :done',
          ExpressionAttributeValues: {
            ':name': updatedTodo.name,
            ':dueDate': updatedTodo.dueDate,
            ':done': updatedTodo.done
          },
          ExpressionAttributeNames: {
            '#name': 'name'
          },
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()
      const updatedTodoItem = result.Attributes
      logger.info('updateTodoItem result', result)
      return updatedTodoItem as TodoUpdate
    } catch (error) {
      logger.error('updateTodoItem data access', error)
    }
}


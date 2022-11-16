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
        return  result.Items as TodoItem[];
    }
}


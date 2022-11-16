import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../logic/todos'
import { getUserId } from '../utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('updateTodo lambda function invoked')

    try {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      const userId = getUserId(event)
      const todo = await updateTodo(userId, todoId, updatedTodo)
      return { statusCode: 204, body: JSON.stringify({ item: todo }) }
    } catch (error) {
      console.error(error)
      return { statusCode: 500, body: error.message }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

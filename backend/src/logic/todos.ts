import { TodosAccess } from '../data/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

const logger = createLogger('TodosLogic')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

export async function createTodo(
    userId: string,
    newTodo: CreateTodoRequest
    ): Promise<TodoItem> {
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3Url = attachmentUtils.getAttachmentUrl(todoId)
    const todoItem: TodoItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3Url,
        ...newTodo
    }
    
    logger.info('Creating a new todo', todoItem)
    
    return await todosAccess.createTodoItem(todoItem)
    }

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Getting todos for user', userId)
  return await todosAccess.getTodosForUser(userId)
}



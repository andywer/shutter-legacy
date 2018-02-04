import Koa = require('koa')
import Route = require('koa-route')
import Static = require('koa-static')

export async function createServer (options: { port: number }): Promise<Server> {
  const app = new Koa()
  const httpServer = app.listen(options.port)

  const server = {
    close () {
      httpServer.close()
      return server
    },
    serveDirectory (dirPathOnDisk: string) {
      app.use(Static(dirPathOnDisk))
      return server
    },
    serveDocument (htmlDocument: string, pathServed: string) {
      app.use(Route.get(pathServed, ({ response }) => {
        response.body = htmlDocument
        response.type = 'text/html; charset=utf-8'
      }))
      return server
    },
    get port () {
      return options.port
    }
  }
  return server
}

export interface Server {
  readonly port: number
  close (): Server
  serveDirectory (dirPathOnDisk: string): Server
  serveDocument (htmlDocument: string, pathServed: string): Server
}

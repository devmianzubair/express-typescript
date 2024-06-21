import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: any[], port: number) {
    this.app = express();
    this.port = port;

    this.connectToTheDatabase();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
  }

  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
  }

  private initializeMiddleware() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    })
  }
}

export default App;

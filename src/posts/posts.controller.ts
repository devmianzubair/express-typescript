import * as express from 'express';
import { Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import IPost from './post.interface';
import postModel from './posts.model';

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.index);
    this.router.get(`${this.path}/:id`, this.show);
    this.router.post(this.path, this.create);
    this.router.patch(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  index = (request: Request, response: Response) => {
    this.post.find()
             .then(posts => {
               response.send(posts);
             });
  }

  create = (request: Request, response: Response) => {
    const postData: IPost = request.body;
    const newPost = new this.post(postData);
    newPost.save()
           .then((savedPost) => {
             response.send(savedPost);
           });
  }

  show = (request: Request, response: Response) => {
    const id = request.params.id;
    this.post.findById(id)
             .then((post) => {
               response.send(post);
             });
  }

  update = (request: Request, response: Response) => {
    const id = request.params.id;
    const postData: IPost = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true })
             .then((updatedPost) => {
               response.send(updatedPost);
             });
  }

  delete = (request: Request, response: Response) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id)
             .then((successResponse) => {
               if (successResponse) {
                 response.sendStatus(200);
               } else {
                 response.sendStatus(404);
               }
             });
  }
}

export default PostsController;

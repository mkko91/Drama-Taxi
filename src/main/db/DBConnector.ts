import * as mongoose from 'mongoose';
import { dbKeys } from './config';

export class DBConnector {
  private connectionURI = `mongodb://${dbKeys.userName}:${dbKeys.password}@${dbKeys.host}/${dbKeys.collectionName}`;

  async connectToDB(): Promise<void> {
    mongoose.connection
      .once('open', () => {})
      .on('error', (error) => {
        console.warn('Warning ', error);
      });

    await mongoose.connect(this.connectionURI);
  }
}

import { Injectable } from "@nestjs/common";
import * as md5 from "md5";
import * as couchDBNano from "nano";

import { IImageStorage } from "../services/image-storage.service";

@Injectable()
export class CouchDbStorageProvider implements IImageStorage {
  constructor(private readonly couchDB: couchDBNano.ServerScope) {}

  get images() {
    return this.couchDB.use("images");
  }

  public async fetchImage(imageId: string): Promise<null | Buffer> {
    imageId = md5(imageId);
    try {
      return await this.images.attachment.get(imageId, "urlto.pdf");
    } catch (err) {
      return null;
    }
  }

  public async storeImage(imageId: string, image): Promise<boolean> {
    const images = this.images;
    imageId = md5(imageId);
    try {
      await images.attachment.get(imageId, "urlto.pdf");
      return true;
    } catch (err) {
      await images.attachment.insert(imageId, "urlto.pdf", image, "application/pdf");
    }

    return true;
  }
}

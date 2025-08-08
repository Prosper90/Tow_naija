import Document from "../models/Documents";
import { DocumentI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class DocumentRepository extends BaseRepository<DocumentI> {
  constructor() {
    super(Document);
  }
}

export default DocumentRepository;
